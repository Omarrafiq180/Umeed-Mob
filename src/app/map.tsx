import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow } from "../constants/theme";
import { useLoad } from "../hooks/useLoad";
import { complaintService } from "../services";
import ScreenHeader from "../components/ScreenHeader";
import ComplaintCard from "../components/ComplaintCard";
import { Empty, ErrorView, Loading } from "../components/States";

// MVP: a real map comes later. For now, complaints are grouped by building.
export default function CampusMap() {
  const { data, loading, error, reload } = useLoad(() => complaintService.mine());
  const groups: Record<string, typeof data> = {};
  (data ?? []).forEach((c) => {
    const k = c.location?.building || "Other location";
    (groups[k] = groups[k] ?? []).push(c);
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader back title="Campus Issue Map" subtitle="Issues grouped by location" />
      {loading && !data ? <Loading /> : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {Object.keys(groups).length === 0 ? <Empty text="No issues yet" /> : null}
          {Object.entries(groups).map(([place, items]) => (
            <View key={place} style={{ marginBottom: 14 }}>
              <View style={[s.pin, shadow]}>
                <Ionicons name="location" size={18} color={colors.ink} />
                <Text style={s.place}>{place}</Text>
                <Text style={s.count}>{items?.length}</Text>
              </View>
              {items?.map((c) => <ComplaintCard key={c._id} item={c} />)}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  pin: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.secondary, borderRadius: radius.md, padding: 10, marginBottom: 10 },
  place: { flex: 1, fontWeight: "800", color: colors.ink },
  count: { fontWeight: "800", color: colors.ink },
});
