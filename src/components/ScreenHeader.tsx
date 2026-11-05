import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../constants/theme";

type Props = { title: string; subtitle?: string; back?: boolean };

export default function ScreenHeader({ title, subtitle, back }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={[s.wrap, { paddingTop: insets.top + 14 }]}>
      {back ? (
        <Pressable onPress={() => router.back()} hitSlop={12} style={s.back}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title}</Text>
        {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary, paddingHorizontal: 20, paddingBottom: 22,
    flexDirection: "row", alignItems: "center", gap: 12,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  title: { color: colors.white, fontSize: 22, fontWeight: "800" },
  sub: { color: colors.primarySoft, fontSize: 13, marginTop: 2 },
});
