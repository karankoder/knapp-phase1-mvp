export const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: "astra_onboarding_complete",
  HANDLE: "astra_handle",
  SEED_PHRASE: "astra_seed_phrase",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
