import { StyleSheet, Text, View } from "react-native";
import { statusColor } from "../constants/theme";

export default function StatusChip({ status }: { status: string }) {
  const c = statusColor[status] ?? "#64748B";
  return (
    <View style={[s.chip, { backgroundColor: c + "22" }]}>
      <Text style={[s.text, { color: c }]}>{status}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start" },
  text: { fontSize: 12, fontWeight: "700" },
});
