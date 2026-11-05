import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/theme";
import Button from "./Button";

export const Loading = () => (
  <View style={s.center}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

export const Empty = ({ text, icon = "file-tray-outline" }: { text: string; icon?: keyof typeof Ionicons.glyphMap }) => (
  <View style={s.center}>
    <Ionicons name={icon} size={44} color={colors.border} />
    <Text style={s.text}>{text}</Text>
  </View>
);

export const ErrorView = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <View style={s.center}>
    <Ionicons name="cloud-offline-outline" size={44} color={colors.red} />
    <Text style={s.text}>{message}</Text>
    <View style={{ width: 160, marginTop: 14 }}>
      <Button title="Try again" onPress={onRetry} variant="outline" />
    </View>
  </View>
);

const s = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center", padding: 32, gap: 8 },
  text: { color: colors.muted, textAlign: "center", fontSize: 14 },
});
