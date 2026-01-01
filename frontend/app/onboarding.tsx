import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { GateScreen } from "../components/onboarding/GateScreen";
import { IdentityScreen } from "../components/onboarding/IdentityScreen";
import { RestoreScreen } from "../components/onboarding/RestoreScreen";
import { SecurityScreen } from "../components/onboarding/SecurityScreen";
import { VaultOpeningAnimation } from "../components/onboarding/VaultOpeningAnimation";
import { WelcomeBackScreen } from "../components/onboarding/WelcomeBackScreen";
import { generateSeedPhrase } from "../utils/seedPhrase";
import { StorageService } from "../utils/storage";

type OnboardingStep =
  | "gate"
  | "identity"
  | "security"
  | "restore"
  | "welcome-back";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("gate");
  const [handle, setHandle] = useState("");
  const [keyCopied, setKeyCopied] = useState(false);
  const [isVaultOpening, setIsVaultOpening] = useState(false);
  const [existingUser, setExistingUser] = useState<string | null>(null);
  const [seedPhrase] = useState(generateSeedPhrase());

  useEffect(() => {
    checkExistingUser();
  }, []);

  // Prevent access to onboarding if already completed (unless in welcome-back flow)
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const isComplete = await StorageService.isOnboardingComplete();
      const hasUser = await StorageService.hasExistingUser();

      // If onboarding is complete and user exists, redirect to home
      // unless we're in the welcome-back flow
      if (isComplete && hasUser && step !== "welcome-back") {
        router.replace("/");
      }
    };
    checkOnboardingStatus();
  }, [router, step]);

  const checkExistingUser = async () => {
    try {
      const hasUser = await StorageService.hasExistingUser();
      if (hasUser) {
        const savedHandle = await StorageService.getHandle();
        if (savedHandle) {
          setExistingUser(savedHandle);
          setStep("welcome-back");
        }
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
    }
  };

  const handleCopyKey = async () => {
    await Clipboard.setStringAsync(seedPhrase.join(" "));
    setKeyCopied(true);
  };

  const handleFinish = async () => {
    if (!handle.trim()) {
      console.error("Handle is required");
      return;
    }

    setIsVaultOpening(true);
    try {
      const results = await Promise.all([
        StorageService.setOnboardingComplete(),
        StorageService.setHandle(handle),
        StorageService.setSeedPhrase(seedPhrase.join(" ")),
      ]);

      const allSuccess = results.every((result) => result === true);
      if (!allSuccess) {
        console.error("Error saving data: Some operations failed");
        setIsVaultOpening(false);
        return;
      }

      setTimeout(() => router.replace("/"), 1500);
    } catch (error) {
      console.error("Error saving data:", error);
      setIsVaultOpening(false);
    }
  };

  const handleRestore = async (restoredHandle: string) => {
    if (!restoredHandle.trim()) {
      console.error("Handle is required");
      return;
    }

    setIsVaultOpening(true);
    try {
      const results = await Promise.all([
        StorageService.setOnboardingComplete(),
        StorageService.setHandle(restoredHandle),
      ]);

      const allSuccess = results.every((result) => result === true);
      if (!allSuccess) {
        console.error("Error restoring: Some operations failed");
        setIsVaultOpening(false);
        return;
      }

      setTimeout(() => router.replace("/"), 1500);
    } catch (error) {
      console.error("Error restoring:", error);
      setIsVaultOpening(false);
    }
  };

  const handleBioUnlock = () => {
    setIsVaultOpening(true);
    setTimeout(() => router.replace("/"), 1200);
  };

  const handleNewAccount = async () => {
    try {
      const success = await StorageService.clearUserData();
      if (success) {
        setExistingUser(null);
        setStep("gate");
      } else {
        console.error("Error clearing user data");
      }
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {isVaultOpening && <VaultOpeningAnimation />}

      {step === "gate" && !isVaultOpening && (
        <GateScreen
          onInitialize={() => setStep("identity")}
          onRestore={() => setStep("restore")}
        />
      )}

      {step === "identity" && !isVaultOpening && (
        <IdentityScreen
          handle={handle}
          setHandle={setHandle}
          onNext={() => setStep("security")}
        />
      )}

      {step === "security" && !isVaultOpening && (
        <SecurityScreen
          seedPhrase={seedPhrase}
          keyCopied={keyCopied}
          onCopyKey={handleCopyKey}
          onFinish={handleFinish}
        />
      )}

      {step === "restore" && !isVaultOpening && (
        <RestoreScreen
          onRestore={handleRestore}
          onBack={() => setStep("gate")}
        />
      )}

      {step === "welcome-back" && !isVaultOpening && existingUser && (
        <WelcomeBackScreen
          handle={existingUser}
          onUnlock={handleBioUnlock}
          onNewAccount={handleNewAccount}
        />
      )}
    </View>
  );
}
