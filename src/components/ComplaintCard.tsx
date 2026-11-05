import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius, shadow } from "../constants/theme";
import { Complaint } from "../types";
import { timeAgo } from "../utils/format";
import Badge from "./Badge";
import StatusChip from "./StatusChip";

export default function ComplaintCard({ item }: { item: Complaint }) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(`/complaint/${item._id}`)} style={[s.card, shadow]}>
      <View style={s.row}>
        <Text style={s.title} numberOfLines={1}>{item.title}</Text>
        <StatusChip status={item.status} />
      </View>
      <Text style={s.desc} numberOfLines={2}>{item.description}</Text>
      <View style={[s.row, { marginTop: 10 }]}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <Badge text={item.category} tone="green" />
          <Badge text={item.priority} tone={item.priority === "High" ? "red" : item.priority === "Medium" ? "yellow" : "muted"} />
        </View>
        <Text style={s.time}>{timeAgo(item.createdAt)}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { flex: 1, fontSize: 16, fontWeight: "700", color: colors.ink },
  desc: { color: colors.muted, marginTop: 6, fontSize: 13 },
  time: { color: colors.muted, fontSize: 12 },
});
