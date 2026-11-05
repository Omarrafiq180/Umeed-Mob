import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow } from "../constants/theme";
import { useLoad } from "../hooks/useLoad";
import { announcementService } from "../services";
import ScreenHeader from "../components/ScreenHeader";
import Badge from "../components/Badge";
import { Empty, ErrorView, Loading } from "../components/States";
import { timeAgo } from "../utils/format";

export default function Announcements() {
  const { data, loading, error, reload } = useLoad(() => announcementService.list());
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader back title="Announcements" subtitle="Campus notices" />
      <View style={{ flex: 1, padding: 16 }}>
        {loading && !data ? <Loading /> : error ? (
          <ErrorView message={error} onRetry={reload} />
        ) : (
          <FlatList
            data={data ?? []}
            keyExtractor={(a) => a._id}
            ListEmptyComponent={<Empty text="No announcements" />}
            renderItem={({ item }) => (
              <View style={[s.card, shadow]}>
                <View style={s.row}>
                  <Text style={s.title}>{item.title}</Text>
                  {item.category ? <Badge text={item.category} tone="yellow" /> : null}
                </View>
                <Text style={s.body}>{item.body}</Text>
                <Text style={s.time}>{timeAgo(item.createdAt)}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: colors.secondary },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  title: { flex: 1, fontWeight: "700", fontSize: 16, color: colors.ink },
  body: { color: colors.muted, marginTop: 6, fontSize: 13 },
  time: { color: colors.muted, fontSize: 11, marginTop: 8 },
});
