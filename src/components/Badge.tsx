import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function Badge({ text, tone = "muted" }: { text: string; tone?: "muted" | "yellow" | "green" | "red" }) {
  const map = {
    muted: [colors.border, colors.muted],
    yellow: [colors.secondarySoft, "#854D0E"],
    green: [colors.primarySoft, colors.primaryDark],
    red: ["#FEE2E2", colors.red],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[s.b, { backgroundColor: bg }]}>
      <Text style={[s.t, { color: fg }]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  b: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  t: { fontSize: 11, fontWeight: "700" },
});
