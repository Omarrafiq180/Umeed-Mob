import { ColorValue, Pressable, View } from "react-native";
import { Redirect, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const icon = (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} size={size} color={color as string} />;

export default function TabsLayout() {
  const router = useRouter();
  const { user, loading } = useAuth();
  if (!loading && !user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 6, backgroundColor: colors.white, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: icon("home") }} />
      <Tabs.Screen name="my-issues" options={{ title: "My Issues", tabBarIcon: icon("list") }} />
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarButton: () => (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Pressable
                onPress={() => router.push("/report")}
                style={{
                  marginTop: -24, width: 62, height: 62, borderRadius: 31, backgroundColor: colors.secondary,
                  alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: colors.white,
                  elevation: 8, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6,
                }}
              >
                <Ionicons name="add" size={32} color={colors.ink} />
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen name="welfare" options={{ title: "Welfare", tabBarIcon: icon("heart") }} />
      <Tabs.Screen name="alerts" options={{ title: "Alerts", tabBarIcon: icon("notifications") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: icon("person") }} />
    </Tabs>
  );
}
