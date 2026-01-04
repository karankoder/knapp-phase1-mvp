import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import prisma from "../config/prisma";
import { ErrorHandler } from "../utils/errorHandler";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../utils/constants";

class AuthService {
  private verifySignature(
    publicAddress: string,
    signature: string,
    timestamp: number
  ) {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    if (timestamp < fiveMinutesAgo) {
      throw new ErrorHandler("Login request expired. Please try again.", 401);
    }

    const message = `Login to ASTRA: ${timestamp}`;

    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (error) {
      throw new ErrorHandler("Invalid signature format", 400);
    }

    if (recoveredAddress.toLowerCase() !== publicAddress.toLowerCase()) {
      throw new ErrorHandler("Signature verification failed", 401);
    }
  }

  public async register(
    handle: string,
    publicAddress: string,
    signature: string,
    timestamp: number
  ) {
    if (!ethers.isAddress(publicAddress)) {
      throw new ErrorHandler("Invalid Ethereum wallet address", 400);
    }

    const normalizedAddress = publicAddress.toLowerCase();

    this.verifySignature(normalizedAddress, signature, timestamp);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ handle }, { publicAddress: normalizedAddress }],
      },
    });

    if (existingUser) {
      if (existingUser.handle === handle)
        throw new ErrorHandler("Handle already taken", 409);
      if (existingUser.publicAddress === normalizedAddress)
        throw new ErrorHandler("Wallet address already registered", 409);
    }

    const newUser = await prisma.user.create({
      data: {
        handle,
        publicAddress: normalizedAddress,
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        handle: newUser.handle,
        address: newUser.publicAddress,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { user: newUser, token };
  }

  public async login(
    publicAddress: string,
    signature: string,
    timestamp: number
  ) {
    if (!ethers.isAddress(publicAddress)) {
      throw new ErrorHandler("Invalid Ethereum wallet address", 400);
    }

    const normalizedAddress = publicAddress.toLowerCase();

    this.verifySignature(normalizedAddress, signature, timestamp);

    const user = await prisma.user.findUnique({
      where: { publicAddress: normalizedAddress },
    });

    if (!user) {
      throw new ErrorHandler("Account not found. Please register.", 404);
    }

    const token = jwt.sign(
      { id: user.id, handle: user.handle, address: user.publicAddress },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { user, token };
  }
}

export const authService = new AuthService();
