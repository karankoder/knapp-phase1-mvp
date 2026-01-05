import { ethers } from "ethers";
import prisma from "../config/prisma";
import { TxStatus } from "../generated/prisma";
import { ErrorHandler } from "../utils/errorHandler";
import { RPC_URL } from "../utils/constants";

const provider = new ethers.JsonRpcProvider(RPC_URL);
class TransactionService {
  public async resolveHandle(handle: string) {
    const user = await prisma.user.findUnique({
      where: { handle },
      select: {
        id: true,
        handle: true,
        publicAddress: true,
        displayName: true,
        profilePicUrl: true,
      },
    });

    if (!user) {
      throw new ErrorHandler(`User @${handle} not found`, 404);
    }

    return user;
  }

  public async syncTransaction(data: {
    senderProfile: any;
    receiverAddress: string;
    txHash: string;
    amount: number | string;
    rawAmountWei: string;
    assetSymbol: string;
    category?: string;
    userNote?: string;
  }) {
    const normalizedTxHash = data.txHash.toLowerCase();
    const normalizedSenderAddress =
      data.senderProfile.publicAddress.toLowerCase();
    const normalizedReceiverAddress = data.receiverAddress.toLowerCase();

    const existingTx = await prisma.transaction.findUnique({
      where: { txHash: normalizedTxHash },
    });

    if (existingTx) {
      throw new ErrorHandler("Transaction already synced", 409);
    }

    const tx = await provider.getTransaction(normalizedTxHash);

    if (!tx) {
      throw new ErrorHandler("Transaction hash not found on the network", 404);
    }

    if (!tx.from || tx.from.toLowerCase() !== normalizedSenderAddress) {
      throw new ErrorHandler(
        "Transaction signer does not match the logged-in user",
        403
      );
    }

    if (!tx.to || tx.to.toLowerCase() !== normalizedReceiverAddress) {
      throw new ErrorHandler(
        "Transaction receiver on-chain does not match the request",
        400
      );
    }

    if (tx.value.toString() !== data.rawAmountWei) {
      throw new ErrorHandler(
        "Transaction amount on-chain does not match the declared amount",
        400
      );
    }

    const calculatedDecimal = ethers.formatEther(data.rawAmountWei);

    if (parseFloat(calculatedDecimal) !== parseFloat(data.amount.toString())) {
      throw new ErrorHandler(
        `Decimal amount mismatch. Wei: ${data.rawAmountWei} equals ${calculatedDecimal} ETH, but received ${data.amount}`,
        400
      );
    }

    const receiver = await prisma.user.findUnique({
      where: { publicAddress: normalizedReceiverAddress },
    });

    // if (!receiver) {
    //   // If the receiver isn't in our app, we can't link them in the relational DB easily.
    //   // For Phase 1, we assume all transfers are between app users.
    //   // If we want to support sending to external wallets, we'd need to make receiverId nullable in schema.
    //   throw new ErrorHandler("Receiver is not a registered user", 404);
    // }

    const transaction = await prisma.transaction.create({
      data: {
        senderId: data.senderProfile.id,
        receiverId: receiver ? receiver.id : null,
        receiverAddress: normalizedReceiverAddress,
        txHash: normalizedTxHash,
        assetSymbol: data.assetSymbol,
        amount: data.amount,
        rawAmountWei: data.rawAmountWei,
        category: data.category,
        userNote: data.userNote,
        status: "COMPLETED",
      },
      include: {
        sender: { select: { handle: true } },
        receiver: { select: { handle: true } },
      },
    });

    return transaction;
  }

  public async getHistory(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: { handle: true, profilePicUrl: true, publicAddress: true },
        },
        receiver: {
          select: { handle: true, profilePicUrl: true, publicAddress: true },
        },
      },
    });
    return transactions;
  }

  public async getTransactionById(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        sender: { select: { handle: true } },
        receiver: { select: { handle: true } },
      },
    });

    if (!transaction) {
      throw new ErrorHandler("Transaction not found", 404);
    }

    if (transaction.senderId !== userId && transaction.receiverId !== userId) {
      throw new ErrorHandler("Not authorized to view this transaction", 403);
    }

    return transaction;
  }

  public async updateTransaction(
    userId: string,
    transactionId: string,
    status?: TxStatus,
    category?: string,
    userNote?: string
  ) {
    const existingTx = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTx) {
      throw new ErrorHandler("Transaction not found", 404);
    }

    if (existingTx.senderId !== userId && existingTx.receiverId !== userId) {
      throw new ErrorHandler("Not authorized to edit this transaction", 403);
    }

    const updatedTx = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        category,
        userNote,
      },
    });

    return updatedTx;
  }
}

export const transactionService = new TransactionService();
