export const formatCurrency = (
  value: number,
  decimals: number = 2,
  symbol: string = "$",
): string => {
  if (isNaN(value)) return `${symbol}0.00`;

  return `${symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

export const formatTokenAmount = (
  amount: number | string,
  symbol: string,
  maxDecimals: number = 6,
): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return `0 ${symbol}`;

  if (numAmount < 0.001 && numAmount > 0) {
    return `${numAmount.toFixed(8)} ${symbol}`;
  }

  const decimals =
    numAmount < 1 ? Math.min(maxDecimals, 4) : numAmount < 100 ? 4 : 2;

  return `${numAmount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })} ${symbol}`;
};

export const calculatePercentageAmount = (
  percentage: string,
  balance: number,
): number => {
  if (percentage === "MAX") return balance;

  const pct = parseInt(percentage.replace("%", ""));
  if (isNaN(pct)) return 0;

  return balance * (pct / 100);
};

export const validateBalance = (
  amount: number,
  balance: number,
): {
  isValid: boolean;
  message?: string;
} => {
  if (amount <= 0) {
    return { isValid: false, message: "Amount must be greater than 0" };
  }

  if (amount > balance) {
    return {
      isValid: false,
      message: "Insufficient balance",
    };
  }

  return { isValid: true };
};

export const parseAmount = (amountStr: string): number => {
  if (!amountStr || amountStr.trim() === "") return 0;

  const cleaned = amountStr.replace(/,/g, "");
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
};

export const formatChange = (
  change: number,
  showSign: boolean = true,
): string => {
  if (isNaN(change)) return "0.00%";

  const sign = change >= 0 ? (showSign ? "+" : "") : "";
  return `${sign}${change.toFixed(2)}%`;
};
