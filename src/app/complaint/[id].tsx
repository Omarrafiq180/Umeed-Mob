import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow, statusColor } from "../../constants/theme";
import { useLoad } from "../../hooks/useLoad";
import { complaintService } from "../../services";
import ScreenHeader from "../../components/ScreenHeader";
import StatusChip from "../../components/StatusChip";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import { ErrorView, Loading } from "../../components/States";
import { formatDate } from "../../utils/format";

export default function ComplaintDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: c, loading, error, reload } = useLoad(() => complaintService.get(id), [id]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader back title="Complaint Tracking" />
      {loading && !c ? <Loading /> : error || !c ? (
        <ErrorView message={error || "Complaint not found"} onRetry={reload} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View style={[s.card, shadow]}>
            <StatusChip status={c.status} />
            <Text style={s.title}>{c.title}</Text>
            <View style={{ flexDirection: "row", gap: 6, marginVertical: 8 }}>
              <Badge text={c.category} tone="green" />
              <Badge text={c.priority} tone={c.priority === "High" ? "red" : c.priority === "Medium" ? "yellow" : "muted"} />
            </View>
            <Text style={s.desc}>{c.description}</Text>
            <View style={s.info}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
              <Text style={s.infoText}>{[c.location?.building, c.location?.room].filter(Boolean).join(", ") || "No location given"}</Text>
            </View>
            <View style={s.info}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
              <Text style={s.infoText}>{c.assignedTo?.name ? `Assigned: ${c.assignedTo.name}` : "Not assigned yet"}</Text>
            </View>
            {c.images?.length ? (
              <ScrollView horizontal style={{ marginTop: 12 }} contentContainerStyle={{ gap: 8 }}>
                {c.images.map((u) => <Image key={u} source={{ uri: u }} style={s.img} />)}
              </ScrollView>
            ) : null}
          </View>

          <Text style={s.h}>Status timeline</Text>
          <View style={[s.card, shadow]}>
            {c.timeline.map((t, i) => {
              const who = typeof t.by === "string" ? t.by : t.by?.name;
              return (
                <View key={i} style={s.tRow}>
                  <View style={{ alignItems: "center" }}>
                    <View style={[s.dot, { backgroundColor: statusColor[t.status] ?? colors.muted }]} />
                    {i < c.timeline.length - 1 ? <View style={s.line} /> : null}
                  </View>
                  <View style={{ flex: 1, paddingBottom: 16 }}>
                    <Text style={s.tStatus}>{t.status}</Text>
                    {t.note ? <Text style={s.tNote}>{t.note}</Text> : null}
                    <Text style={s.tTime}>{[who, formatDate(t.at)].filter(Boolean).join(" • ")}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {c.status === "Resolved" ? (
            c.rating ? (
              <View style={[s.card, shadow]}>
                <Text style={s.tStatus}>Your rating</Text>
                <View style={{ flexDirection: "row", gap: 4, marginVertical: 6 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Ionicons key={n} name={n <= (c.rating ?? 0) ? "star" : "star-outline"} size={24} color={colors.secondary} />
                  ))}
                </View>
                {c.feedback ? <Text style={s.desc}>{c.feedback}</Text> : null}
              </View>
            ) : (
              <Button title="Give rating & feedback" onPress={() => router.push(`/feedback/${c._id}`)} variant="secondary" />
            )
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink, marginTop: 10 },
  desc: { color: colors.muted, lineHeight: 20 },
  info: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 10 },
  infoText: { color: colors.ink, fontSize: 14 },
  img: { width: 110, height: 110, borderRadius: radius.md },
  h: { fontSize: 17, fontWeight: "800", color: colors.ink, marginBottom: 10 },
  tRow: { flexDirection: "row", gap: 12 },
  dot: { width: 14, height: 14, borderRadius: 7, marginTop: 3 },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 2 },
  tStatus: { fontWeight: "700", color: colors.ink, fontSize: 15 },
  tNote: { color: colors.muted, marginTop: 2, fontSize: 13 },
  tTime: { color: colors.muted, fontSize: 11, marginTop: 3 },
});
