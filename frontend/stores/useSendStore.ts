import { create } from "zustand";

export type SendStep = "recipient" | "amount" | "confirm";

interface Recipient {
  id: string;
  name: string;
  handle: string;
  publicAddress: string;
  avatar: string;
}

interface SendState {
  // State
  step: SendStep;
  recipient: Recipient | null;
  amount: string;
  coinSymbol: string;

  // Actions
  setStep: (step: SendStep) => void;
  setRecipient: (recipient: Recipient | null) => void;
  setAmount: (amount: string) => void;
  setCoinSymbol: (symbol: string) => void;
  reset: () => void;
}

export const useSendStore = create<SendState>((set) => ({
  step: "recipient",
  recipient: null,
  amount: "",
  coinSymbol: "ETH",

  setStep: (step) => set({ step }),
  setRecipient: (recipient) => set({ recipient }),
  setAmount: (amount) => set({ amount }),
  setCoinSymbol: (coinSymbol) => set({ coinSymbol }),

  reset: () =>
    set({
      step: "recipient",
      recipient: null,
      amount: "",
      coinSymbol: "ETH",
    }),
}));
