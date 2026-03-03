import { View, Text, ScrollView, Modal, Pressable } from "react-native";
import { MotiView } from "moti";
import { ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/utils/constants";

interface TermsOfServiceScreenProps {
  isOpen: boolean;
  onBack: () => void;
}

export const TermsOfServiceScreen = ({
  isOpen,
  onBack,
}: TermsOfServiceScreenProps) => {
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  const sections = [
    {
      title: "1. Introduction",
      body: "Welcome to ATARA, operated by ATARA LTD. By accessing or using our services, you agree to be bound by these Terms of Service. ATARA LTD provides a non-custodial digital wallet interface for managing digital assets on supported blockchain networks.",
    },
    {
      title: "2. Self-Custody Notice",
      highlight: "You are solely responsible for your wallet and private keys.",
      body: "ATARA operates as a self-custody solution. This means:",
      bullets: [
        "You control your private keys and recovery phrase",
        "ATARA cannot access, recover, or reset your wallet",
        "Loss of your credentials means permanent loss of access to your assets",
        "You are responsible for securing your device and credentials",
      ],
    },
    {
      title: "3. Transaction Finality",
      highlight:
        "All transactions on the Base Network are final and irreversible.",
      body: "Once a transaction is confirmed on the blockchain:",
      bullets: [
        "It cannot be reversed, cancelled, or modified",
        "ATARA has no ability to reverse or refund transactions",
        "You must verify all transaction details before confirming",
        "Network fees are non-refundable regardless of transaction outcome",
      ],
    },
    {
      title: "4. Beta Testing Acknowledgment",
      highlight: "ATARA is currently in beta testing phase.",
      body: "By using ATARA during beta, you acknowledge:",
      bullets: [
        "The application may contain bugs or unexpected behavior",
        "Features may change, be added, or removed without notice",
        "Service interruptions may occur during updates",
        "You should not store more value than you can afford to lose",
        "Your feedback helps improve the platform for all users",
      ],
    },
    {
      title: "5. Supported Networks",
      body: "ATARA currently operates on the Base Network (a Layer 2 solution built on Ethereum). Transactions are processed according to the network's consensus rules and are subject to network conditions, fees, and potential delays.",
    },
    {
      title: "6. Prohibited Activities",
      body: "You agree not to use ATARA for:",
      bullets: [
        "Money laundering or terrorist financing",
        "Fraudulent or deceptive activities",
        "Violating applicable laws or regulations",
        "Circumventing security measures",
        "Any activity that could harm the platform or its users",
      ],
    },
    {
      title: "7. Limitation of Liability",
      body: 'ATARA is provided "as is" without warranties of any kind. To the maximum extent permitted by law, ATARA LTD shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the service, including but not limited to loss of digital assets.',
    },
    {
      title: "8. Privacy",
      body: "ATARA respects your privacy. We collect minimal data necessary to provide our services. Your wallet information and transaction history are stored locally on your device. Please review our Privacy Policy for detailed information.",
    },
    {
      title: "9. Contact",
      body: "For questions about these Terms or to report issues, please use the in-app feedback feature or contact us at legal@atara.money.",
    },
  ];

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleBack}
    >
      <View className="flex-1" style={{ backgroundColor: COLORS.black }}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 250 }}
          className="flex-row items-center gap-3 px-6 pt-14 pb-4 border-b"
          style={{ borderBottomColor: `${COLORS.white}10` }}
        >
          <Pressable
            onPress={handleBack}
            className="w-10 h-10 rounded-full items-center justify-center border border-white/10"
            style={{ backgroundColor: `${COLORS.white}08` }}
          >
            <ArrowLeft size={18} color={COLORS.white} />
          </Pressable>
          <Text className="text-lg font-semibold text-white">
            Terms of Service
          </Text>
        </MotiView>

        {/* Content */}
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            className="text-xs font-mono mb-6"
            style={{ color: `${COLORS.white}30` }}
          >
            Last Updated: January 2025
          </Text>

          {sections.map((section, idx) => (
            <MotiView
              key={idx}
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: "timing",
                duration: 200,
                delay: 60 + idx * 40,
              }}
              className="mb-6"
            >
              <Text className="text-white font-semibold text-sm mb-2">
                {section.title}
              </Text>
              {section.highlight && (
                <Text className="text-white font-medium text-sm mb-2">
                  {section.highlight}
                </Text>
              )}
              <Text
                className="text-sm leading-5"
                style={{ color: `${COLORS.white}60` }}
              >
                {section.body}
              </Text>
              {section.bullets?.map((bullet, bIdx) => (
                <View key={bIdx} className="flex-row mt-1.5 pl-2">
                  <Text
                    className="text-sm mr-2"
                    style={{ color: `${COLORS.white}40` }}
                  >
                    •
                  </Text>
                  <Text
                    className="text-sm flex-1 leading-5"
                    style={{ color: `${COLORS.white}50` }}
                  >
                    {bullet}
                  </Text>
                </View>
              ))}
            </MotiView>
          ))}

          {/* Footer */}
          <View
            className="pt-6 border-t"
            style={{ borderTopColor: `${COLORS.white}08` }}
          >
            <Text
              className="text-xs text-center"
              style={{ color: `${COLORS.white}30` }}
            >
              © 2025 ATARA LTD. All rights reserved. By using ATARA, you
              acknowledge that you have read, understood, and agree to these
              Terms of Service.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
