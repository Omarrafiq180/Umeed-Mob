import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import ScreenHeader from "../../components/ScreenHeader";
import Button from "../../components/Button";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const rows: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string }[] = [
    { icon: "mail-outline", label: "Email", value: user?.email },
    { icon: "card-outline", label: "Student ID", value: user?.studentId },
    { icon: "school-outline", label: "Department", value: user?.department },
    { icon: "call-outline", label: "Phone", value: user?.phone },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Profile" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <Text style={s.initial}>{user?.name?.[0]?.toUpperCase() ?? "U"}</Text>
          </View>
          <Text style={s.name}>{user?.name}</Text>
        </View>

        <View style={[s.card, shadow]}>
          {rows.map((r) => (
            <View key={r.label} style={s.row}>
              <Ionicons name={r.icon} size={20} color={colors.primary} />
              <View>
                <Text style={s.label}>{r.label}</Text>
                <Text style={s.value}>{r.value || "-"}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={[s.link, shadow]} onPress={() => router.push("/announcements")}>
          <Ionicons name="megaphone-outline" size={20} color={colors.primary} />
          <Text style={s.linkText}>Campus Announcements</Text>
        </Pressable>
        <Pressable style={[s.link, shadow]} onPress={() => router.push("/map")}>
          <Ionicons name="map-outline" size={20} color={colors.primary} />
          <Text style={s.linkText}>Campus Issue Map</Text>
        </Pressable>

        <View style={{ marginTop: 20 }}>
          <Button title="Logout" variant="outline" onPress={logout} />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  avatarWrap: { alignItems: "center", marginVertical: 10 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: colors.white },
  initial: { fontSize: 34, fontWeight: "800", color: colors.ink },
  name: { fontSize: 20, fontWeight: "800", color: colors.ink, marginTop: 10 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, marginTop: 14, gap: 16 },
  row: { flexDirection: "row", gap: 14, alignItems: "center" },
  label: { fontSize: 11, color: colors.muted },
  value: { fontSize: 15, color: colors.ink, fontWeight: "600" },
  link: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, marginTop: 12 },
  linkText: { fontWeight: "700", color: colors.ink },
});
