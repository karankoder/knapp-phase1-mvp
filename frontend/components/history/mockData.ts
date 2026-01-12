export type TransactionType = "receive" | "send";

export interface Transaction {
  id: number;
  name: string;
  date: string;
  time: string;
  amount: string;
  value: string;
  type: TransactionType;
}

export const ALL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    name: "Bitcoin Purchase",
    date: "Dec 16, 2024",
    time: "2:34 PM",
    amount: "+0.024 BTC",
    value: "$1,038.00",
    type: "receive",
  },
  {
    id: 2,
    name: "Sent to @Marcus",
    date: "Dec 15, 2024",
    time: "11:20 AM",
    amount: "-$150.00",
    value: "",
    type: "send",
  },
  {
    id: 3,
    name: "Ethereum Swap",
    date: "Dec 14, 2024",
    time: "4:15 PM",
    amount: "+1.2 ETH",
    value: "$2,736.54",
    type: "receive",
  },
  {
    id: 4,
    name: "USDC Transfer",
    date: "Dec 13, 2024",
    time: "9:00 AM",
    amount: "-$500.00",
    value: "",
    type: "send",
  },
  {
    id: 5,
    name: "Solana Reward",
    date: "Dec 12, 2024",
    time: "6:45 PM",
    amount: "+2.5 SOL",
    value: "$246.25",
    type: "receive",
  },
  {
    id: 6,
    name: "Sent to @Elena",
    date: "Dec 11, 2024",
    time: "3:30 PM",
    amount: "-$75.00",
    value: "",
    type: "send",
  },
  {
    id: 7,
    name: "BTC Mining Payout",
    date: "Dec 10, 2024",
    time: "12:00 PM",
    amount: "+0.008 BTC",
    value: "$346.00",
    type: "receive",
  },
  {
    id: 8,
    name: "NFT Purchase",
    date: "Dec 9, 2024",
    time: "8:22 PM",
    amount: "-0.5 ETH",
    value: "$1,140.23",
    type: "send",
  },
];
