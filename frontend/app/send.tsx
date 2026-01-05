import { useRouter } from "expo-router";
import { ArrowLeft, X } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmountStep } from "../components/send/AmountStep";
import { ConfirmStep } from "../components/send/ConfirmStep";
import { RecipientStep } from "../components/send/RecipientStep";

import { useSendStore } from "@/stores/useSendStore";
import { useWallet } from "@/hooks/useWallet";

export default function Send() {
  const router = useRouter();

  const { step, setStep, reset } = useSendStore();

  const { assets, isLoading } = useWallet();

  useEffect(() => {
    reset();
  }, []);

  const handleBack = () => {
    if (step === "recipient") {
      router.back();
    } else if (step === "amount") {
      setStep("recipient");
    } else if (step === "confirm") {
      setStep("amount");
    }
  };

  const handleClose = () => {
    router.back();
  };

  const getHeaderTitle = () => {
    switch (step) {
      case "recipient":
        return "Send To";
      case "amount":
        return "Enter Amount";
      case "confirm":
        return "Confirm";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 py-6 border-b border-champagne/10">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={handleBack}
            className="w-12 h-12 rounded-full bg-ceramic items-center justify-center active:opacity-80 border border-champagne/10"
          >
            <ArrowLeft size={20} color="#FFE666" />
          </Pressable>
          <Text className="text-xl font-rajdhani-semibold text-foreground tracking-wide">
            {getHeaderTitle()}
          </Text>
        </View>
        <Pressable
          onPress={handleClose}
          className="w-12 h-12 rounded-full bg-ceramic items-center justify-center active:opacity-80 border border-champagne/10"
        >
          <X size={20} color="rgba(255, 255, 255, 0.6)" />
        </Pressable>
      </View>

      <View className="flex-1">
        {step === "recipient" && <RecipientStep />}
        {step === "amount" && (
          <AmountStep asset={assets.length > 0 ? assets[0] : undefined} />
        )}
        {step === "confirm" && (
          <ConfirmStep priceUsd={assets.length > 0 ? assets[0].priceUsd : 0} />
        )}
      </View>
    </SafeAreaView>
  );
}
