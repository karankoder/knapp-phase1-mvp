import { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { MotiView } from "moti";
import {
  LogOut,
  ScanFace,
  DollarSign,
  Ghost,
  Palette,
  Bug,
  FileText,
  ShieldCheck,
  ChevronRight,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/utils/constants";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { IdentityCard } from "@/components/profile/IdentityCard";
import { FeedbackModal } from "@/components/profile/FeedbackModal";
import { LogoutModal } from "@/components/profile/LogoutModal";
import { TermsOfServiceScreen } from "@/components/profile/TermsOfServiceScreen";

interface PillOption {
  label: string;
  value: string;
}

const PillGroup = ({
  options,
  selected,
  onSelect,
}: {
  options: PillOption[];
  selected: string;
  onSelect: (v: string) => void;
}) => (
  <View className="flex-row gap-2">
    {options.map((opt) => {
      const active = opt.value === selected;
      return (
        <Pressable
          key={opt.value}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(opt.value);
          }}
          className="px-4 py-2 rounded-full"
          style={{
            backgroundColor: active ? COLORS.accent : `${COLORS.white}08`,
          }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: active ? COLORS.white : `${COLORS.white}50` }}
          >
            {opt.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const SettingRow = ({
  icon: Icon,
  label,
  right,
  onPress,
  delay = 0,
  disabled = false,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  delay?: number;
  disabled?: boolean;
}) => (
  <MotiView
    from={{ opacity: 0, translateY: 10 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: "timing", duration: 300, delay }}
  >
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      className="flex-row items-center rounded-2xl p-4 mb-2 border border-white/10"
      style={{
        backgroundColor: `${COLORS.white}05`,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Icon size={18} color={COLORS.accent} />
      <Text className="text-white text-sm font-medium flex-1 ml-3">
        {label}
      </Text>
      {right}
    </Pressable>
  </MotiView>
);

const SectionHeader = ({
  title,
  delay = 0,
}: {
  title: string;
  delay?: number;
}) => (
  <MotiView
    from={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ type: "timing", duration: 300, delay }}
  >
    <Text
      className="text-xs font-mono uppercase mb-3 mt-4"
      style={{ color: `${COLORS.white}40`, letterSpacing: 1.5 }}
    >
      {title}
    </Text>
  </MotiView>
);

export default function ProfileTab() {
  const [faceId, setFaceId] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [theme, setTheme] = useState("cyber");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.black }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
          className="flex-row items-center justify-between px-6 pt-5 pb-4"
        >
          <Text className="text-white text-2xl font-semibold">Profile</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setLogoutOpen(true);
            }}
            className="w-10 h-10 rounded-full items-center justify-center border border-white/10"
            style={{ backgroundColor: `${COLORS.white}08` }}
          >
            <LogOut size={18} color={`${COLORS.white}60`} />
          </Pressable>
        </MotiView>

        <View className="px-6">
          <ProfileAvatar initials="TV" />

          <IdentityCard
            displayName="Thomas Vance"
            handle="@ThomasV"
            isVerified
          />

          <SectionHeader title="Settings" delay={250} />

          <SettingRow
            icon={ScanFace}
            label="Face ID"
            delay={300}
            right={
              <Switch
                value={faceId}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFaceId(val);
                }}
                trackColor={{
                  false: `${COLORS.white}15`,
                  true: COLORS.accent,
                }}
                thumbColor={COLORS.white}
              />
            }
          />

          <SettingRow
            icon={DollarSign}
            label="Currency"
            delay={350}
            right={
              <PillGroup
                options={[
                  { label: "USD", value: "usd" },
                  { label: "EUR", value: "eur" },
                ]}
                selected={currency}
                onSelect={setCurrency}
              />
            }
          />

          <SettingRow
            icon={Ghost}
            label="Stealth Mode"
            delay={400}
            right={
              <Switch
                value={stealthMode}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setStealthMode(val);
                }}
                trackColor={{
                  false: `${COLORS.white}15`,
                  true: COLORS.accent,
                }}
                thumbColor={COLORS.white}
              />
            }
          />

          <SectionHeader title="Appearance" delay={420} />

          <SettingRow
            icon={Palette}
            label="Theme"
            delay={450}
            right={
              <PillGroup
                options={[
                  { label: "Cyber", value: "cyber" },
                  { label: "Heritage", value: "heritage" },
                ]}
                selected={theme}
                onSelect={setTheme}
              />
            }
          />

          <SectionHeader title="Beta Program" delay={470} />

          <SettingRow
            icon={Bug}
            label="Report Bug"
            delay={500}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFeedbackOpen(true);
            }}
            right={<ChevronRight size={16} color={`${COLORS.white}30`} />}
          />

          <SectionHeader title="Legal" delay={520} />

          <SettingRow
            icon={FileText}
            label="Terms of Service"
            delay={550}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTermsOpen(true);
            }}
            right={<ChevronRight size={16} color={`${COLORS.white}30`} />}
          />

          <SettingRow
            icon={ShieldCheck}
            label="Privacy Policy"
            delay={580}
            disabled
            right={<ChevronRight size={16} color={`${COLORS.white}15`} />}
          />

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 400, delay: 650 }}
            className="items-center mt-8 mb-4"
          >
            <Text
              className="text-xs font-mono"
              style={{ color: `${COLORS.white}40`, letterSpacing: 1 }}
            >
              ATARA · Beta v0.1.0
            </Text>
          </MotiView>
        </View>
      </ScrollView>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
      <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      <TermsOfServiceScreen
        isOpen={termsOpen}
        onBack={() => setTermsOpen(false)}
      />
    </View>
  );
}
