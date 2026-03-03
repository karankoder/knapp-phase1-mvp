import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { MotiView } from "moti";
import { X, Send, Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/utils/constants";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitted(true);
    setTimeout(() => {
      setFeedback("");
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFeedback("");
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      >
        <TouchableOpacity activeOpacity={1}>
          <MotiView
            from={{ translateY: 80, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              backgroundColor: "#0a0a0a",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderWidth: 1,
              borderColor: `${COLORS.white}18`,
              paddingBottom: 40,
            }}
          >
            <View className="items-center pt-3 pb-1">
              <View
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: `${COLORS.white}20` }}
              />
            </View>

            <View className="flex-row items-center justify-between px-6 pt-3 pb-5">
              <Text className="text-lg font-semibold text-white">
                Beta Feedback
              </Text>
              <Pressable
                onPress={handleClose}
                className="w-9 h-9 rounded-full items-center justify-center border border-white/10"
                style={{ backgroundColor: `${COLORS.white}08` }}
              >
                <X size={16} color={`${COLORS.white}60`} />
              </Pressable>
            </View>

            <View className="px-6">
              {isSubmitted ? (
                <MotiView
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 280 }}
                  className="items-center justify-center py-10"
                >
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-4"
                    style={{ backgroundColor: `${COLORS.accent}20` }}
                  >
                    <Check size={28} color={COLORS.accent} />
                  </View>
                  <Text className="text-white font-semibold text-base text-center">
                    Thank you for building ATARA with us
                  </Text>
                  <Text className="text-white/50 text-sm mt-2 text-center">
                    Your feedback helps shape the future
                  </Text>
                </MotiView>
              ) : (
                <View>
                  <Text className="text-sm text-white/50 mb-4">
                    Share your thoughts, report bugs, or suggest features. Every
                    bit of feedback helps us improve.
                  </Text>

                  <TextInput
                    value={feedback}
                    onChangeText={setFeedback}
                    placeholder="Tell us what's on your mind..."
                    placeholderTextColor={`${COLORS.white}30`}
                    multiline
                    maxLength={500}
                    textAlignVertical="top"
                    className="rounded-2xl text-sm text-white px-4 py-3"
                    style={{
                      minHeight: 120,
                      backgroundColor: `${COLORS.white}05`,
                      borderWidth: 1,
                      borderColor: `${COLORS.white}10`,
                    }}
                  />

                  <View className="flex-row justify-between items-center mt-2 mb-6">
                    <Text
                      className="text-xs"
                      style={{ color: `${COLORS.white}30` }}
                    >
                      {feedback.length}/500
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleSubmit}
                    disabled={!feedback.trim()}
                    className="py-4 rounded-2xl flex-row items-center justify-center gap-2"
                    style={{
                      backgroundColor: feedback.trim()
                        ? COLORS.accent
                        : `${COLORS.accent}30`,
                      opacity: feedback.trim() ? 1 : 0.5,
                    }}
                  >
                    <Send size={16} color={COLORS.white} />
                    <Text className="text-sm font-semibold text-white tracking-wide">
                      Send Feedback
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </MotiView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
