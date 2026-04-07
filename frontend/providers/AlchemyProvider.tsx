import { alchemy, base, baseSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";
import {
  AlchemyAccountProvider,
  createConfig,
} from "@account-kit/react-native";
import Constants from "expo-constants";

const queryClient = new QueryClient();

const alchemyApiKey =
  process.env.EXPO_PUBLIC_ALCHEMY_API_KEY ||
  (Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY as
    | string
    | undefined);
const alchemyGasPolicyId =
  process.env.EXPO_PUBLIC_ALCHEMY_GAS_POLICY_ID ||
  (Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_GAS_POLICY_ID as
    | string
    | undefined);

const selectedChain =
  process.env.EXPO_PUBLIC_NETWORK === "base-mainnet" ? base : baseSepolia;

if (!alchemyApiKey) {
  throw new Error("Missing EXPO_PUBLIC_ALCHEMY_API_KEY");
}

export const AlchemyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const config = createConfig({
    chain: selectedChain,
    transport: alchemy({
      apiKey: alchemyApiKey,
    }),
    signerConnection: {
      apiKey: alchemyApiKey,
    },
    sessionConfig: {
      expirationTimeMs: 1000 * 60 * 60 * 24 * 7,
    },
    policyId: alchemyGasPolicyId ?? undefined,
  });

  return (
    <AlchemyAccountProvider config={config} queryClient={queryClient as any}>
      {children}
    </AlchemyAccountProvider>
  );
};
