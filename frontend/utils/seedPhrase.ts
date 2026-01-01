/**
 * Utility for generating seed phrases
 * In production, this should use a proper BIP39 word list and secure random generation
 */
export const generateSeedPhrase = (): string[] => {
  const words = [
    "abandon",
    "ability",
    "able",
    "about",
    "above",
    "absent",
    "absorb",
    "abstract",
    "absurd",
    "abuse",
    "access",
    "accident",
  ];
  return words;
};

