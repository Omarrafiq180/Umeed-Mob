import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radius } from "../constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({ title, onPress, variant = "primary", loading, disabled }: Props) {
  const bg = variant === "primary" ? colors.primary : variant === "secondary" ? colors.secondary : "transparent";
  const fg = variant === "primary" ? colors.white : variant === "secondary" ? colors.ink : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, opacity: pressed || disabled ? 0.8 : 1 },
        variant === "outline" && { borderWidth: 1.5, borderColor: colors.primary },
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[s.text, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: { height: 52, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 16, fontWeight: "700" },
});
