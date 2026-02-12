import { alchemy, baseSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";
import {
  AlchemyAccountProvider,
  createConfig,
} from "@account-kit/react-native";
import Constants from "expo-constants";

const queryClient = new QueryClient();

export const AlchemyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const config = createConfig({
    chain: baseSepolia,
    transport: alchemy({
      apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY!,
    }),
    signerConnection: {
      apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY!,
    },
    sessionConfig: {
      expirationTimeMs: 1000 * 60 * 60 * 24 * 7,
    },

    policyId:
      Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_GAS_POLICY_ID ??
      undefined,
  });

  return (
    <AlchemyAccountProvider config={config} queryClient={queryClient as any}>
      {children}
    </AlchemyAccountProvider>
  );
};
