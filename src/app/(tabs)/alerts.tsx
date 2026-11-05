import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow } from "../../constants/theme";
import { useLoad } from "../../hooks/useLoad";
import { notificationService } from "../../services";
import ScreenHeader from "../../components/ScreenHeader";
import { Empty, ErrorView, Loading } from "../../components/States";
import { timeAgo } from "../../utils/format";

export default function Alerts() {
  const { data, loading, error, reload } = useLoad(() => notificationService.list());
  const unread = (data ?? []).filter((n) => !n.read).length;

  const open = async (id: string) => {
    await notificationService.markRead(id);
    reload();
  };
  const readAll = async () => {
    await notificationService.markAllRead();
    reload();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Alerts" subtitle={unread ? `${unread} new notifications` : "You are all caught up"} />
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 14 }}>
        {unread > 0 ? (
          <Pressable onPress={readAll} style={{ alignSelf: "flex-end", marginBottom: 10 }}>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>Mark all as read</Text>
          </Pressable>
        ) : null}
        {loading && !data ? <Loading /> : error ? (
          <ErrorView message={error} onRetry={reload} />
        ) : (
          <FlatList
            data={data ?? []}
            keyExtractor={(n) => n._id}
            ListEmptyComponent={<Empty text="No notifications" icon="notifications-off-outline" />}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => open(item._id)} style={[s.card, shadow, !item.read && s.unread]}>
                <Ionicons name={item.read ? "notifications-outline" : "notifications"} size={22} color={item.read ? colors.muted : colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={s.title}>{item.title}</Text>
                  <Text style={s.msg}>{item.message}</Text>
                  <Text style={s.time}>{timeAgo(item.createdAt)}</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: "row", gap: 12, backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, marginBottom: 10 },
  unread: { borderLeftWidth: 4, borderLeftColor: colors.secondary },
  title: { fontWeight: "700", color: colors.ink, fontSize: 15 },
  msg: { color: colors.muted, marginTop: 3, fontSize: 13 },
  time: { color: colors.muted, fontSize: 11, marginTop: 6 },
});
