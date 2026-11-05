import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useLoad } from "../../hooks/useLoad";
import { announcementService, complaintService } from "../../services";
import ScreenHeader from "../../components/ScreenHeader";
import ComplaintCard from "../../components/ComplaintCard";
import { Empty, ErrorView, Loading } from "../../components/States";
import { timeAgo } from "../../utils/format";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const complaints = useLoad(() => complaintService.mine());
  const ann = useLoad(() => announcementService.list());

  const list = complaints.data ?? [];
  const count = (st: string) => list.filter((c) => c.status === st).length;
  const stats = [
    { label: "Total", value: list.length, color: colors.ink },
    { label: "Pending", value: count("Pending"), color: colors.amber },
    { label: "In Progress", value: count("In Progress"), color: colors.teal },
    { label: "Resolved", value: count("Resolved"), color: colors.primary },
  ];
  const actions: { label: string; icon: keyof typeof Ionicons.glyphMap; to: string }[] = [
    { label: "Report Issue", icon: "alert-circle", to: "/report" },
    { label: "Welfare", icon: "heart", to: "/welfare" },
    { label: "Notices", icon: "megaphone", to: "/announcements" },
    { label: "Issue Map", icon: "map", to: "/map" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={`Hello, ${user?.name?.split(" ")[0] ?? ""}`} subtitle="What is the issue on campus today?" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={s.actions}>
          {actions.map((a) => (
            <Pressable key={a.label} style={s.action} onPress={() => router.push(a.to as any)}>
              <View style={s.actionIcon}>
                <Ionicons name={a.icon} size={24} color={colors.primaryDark} />
              </View>
              <Text style={s.actionText}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.stats}>
          {stats.map((st) => (
            <View key={st.label} style={[s.stat, shadow]}>
              <Text style={[s.statNum, { color: st.color }]}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.rowBetween}>
          <Text style={s.h}>Announcements</Text>
          <Pressable onPress={() => router.push("/announcements")}>
            <Text style={s.link}>See all</Text>
          </Pressable>
        </View>
        {(ann.data ?? []).slice(0, 2).map((a) => (
          <View key={a._id} style={[s.note, shadow]}>
            <Text style={s.noteTitle}>{a.title}</Text>
            <Text style={s.noteBody} numberOfLines={2}>{a.body}</Text>
            <Text style={s.time}>{timeAgo(a.createdAt)}</Text>
          </View>
        ))}

        <View style={[s.rowBetween, { marginTop: 8 }]}>
          <Text style={s.h}>Recent complaints</Text>
          <Pressable onPress={() => router.push("/my-issues")}>
            <Text style={s.link}>See all</Text>
          </Pressable>
        </View>
        {complaints.loading ? <Loading /> : complaints.error ? (
          <ErrorView message={complaints.error} onRetry={complaints.reload} />
        ) : list.length === 0 ? (
          <Empty text="No complaints yet. Tap + below to report one." />
        ) : (
          list.slice(0, 3).map((c) => <ComplaintCard key={c._id} item={c} />)
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  actions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  action: { alignItems: "center", width: "23%" },
  actionIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.secondarySoft, alignItems: "center", justifyContent: "center" },
  actionText: { fontSize: 12, fontWeight: "600", color: colors.ink, marginTop: 6, textAlign: "center" },
  stats: { flexDirection: "row", gap: 8, marginBottom: 20 },
  stat: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, paddingVertical: 12, alignItems: "center" },
  statNum: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  h: { fontSize: 17, fontWeight: "800", color: colors.ink },
  link: { color: colors.primary, fontWeight: "700", fontSize: 13 },
  note: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: colors.secondary },
  noteTitle: { fontWeight: "700", color: colors.ink, fontSize: 15 },
  noteBody: { color: colors.muted, marginTop: 4, fontSize: 13 },
  time: { color: colors.muted, fontSize: 11, marginTop: 6 },
});
