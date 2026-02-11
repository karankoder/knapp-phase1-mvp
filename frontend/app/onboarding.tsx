import { useState, useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { GateScreen } from "../components/onboarding/GateScreen";
import { IdentityScreen } from "../components/onboarding/IdentityScreen";
import { WelcomeBackScreen } from "../components/onboarding/WelcomeBackScreen";
import { VaultOpeningAnimation } from "../components/onboarding/VaultOpeningAnimation";
import { useSignerStatus, useUser } from "@account-kit/react-native";
import { AlchemySignerStatus } from "@account-kit/signer";
import { useAuthStore } from "@/stores/useAuthStore";
import { AuthService } from "@/services/auth.service";

type OnboardingStep = "gate" | "identity" | "welcome-back";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("gate");
  const [handle, setHandle] = useState("");
  const [isVaultOpening, setIsVaultOpening] = useState(false);

  const { status: signerStatus, isAuthenticating } = useSignerStatus();
  const signerConnected = signerStatus === AlchemySignerStatus.CONNECTED;
  const user = useUser();
  const { isAuthenticated } = useAuthStore();
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  useEffect(() => {
    if (!signerConnected || !user) return;

    if (isAuthenticated) {
      setIsVaultOpening(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 600);
      return;
    }

    const checkExistingUser = async () => {
      setIsCheckingBackend(true);

      try {
        await AuthService.loginWithSigner(user.address);
        setIsVaultOpening(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 600);
      } catch {
        setStep("identity");
      } finally {
        setIsCheckingBackend(false);
      }
    };

    if (step === "gate") {
      checkExistingUser();
    }
  }, [signerConnected, user]);

  const handleAuthSuccess = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleFinish = () => {
    setIsVaultOpening(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 600);
  };

  const handleBioUnlock = () => {
    setIsVaultOpening(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 500);
  };

  return (
    <View className="flex-1 bg-void">
      {isVaultOpening && <VaultOpeningAnimation />}

      {step === "gate" && !isVaultOpening && (
        <GateScreen
          onAuthSuccess={handleAuthSuccess}
          isCheckingBackend={isCheckingBackend || isAuthenticating}
        />
      )}

      {step === "identity" && !isVaultOpening && (
        <IdentityScreen
          handle={handle}
          setHandle={setHandle}
          onFinish={handleFinish}
        />
      )}

      {step === "welcome-back" && !isVaultOpening && user && (
        <WelcomeBackScreen
          handle={user.email || "User"}
          onUnlock={handleBioUnlock}
          onNewAccount={() => setStep("gate")}
        />
      )}
    </View>
  );
}
