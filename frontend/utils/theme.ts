export const AVATAR_GRADIENTS: [string, string][] = [
  ["#8B5CF6", "#7C3AED"], // Violet
  ["#F43F5E", "#EC4899"], // Rose
  ["#F59E0B", "#F97316"], // Amber
  ["#10B981", "#059669"], // Emerald
  ["#3B82F6", "#6366F1"], // Blue
  ["#6366F1", "#8B5CF6"], // Indigo
  ["#EC4899", "#D946EF"], // Fuchsia
  ["#14B8A6", "#0D9488"], // Teal
];

export const getAvatarGradient = (seed?: string): [string, string] => {
  if (!seed) {
    const randomIndex = Math.floor(Math.random() * AVATAR_GRADIENTS.length);
    return AVATAR_GRADIENTS[randomIndex];
  }

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

export const formatAddress = (address: string) => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
