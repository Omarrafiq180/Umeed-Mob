import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { colors, radius, shadow } from "../constants/theme";
import { errorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { USE_MOCK } from "../config";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    if (!email.trim() || !password) return Alert.alert("Missing details", "Please enter both email and password.");
    try {
      setBusy(true);
      await login(email.trim(), password);
      router.replace("/home");
    } catch (e) {
      Alert.alert("Login failed", errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <View style={s.logoCircle}>
            <Text style={s.logo}>امید</Text>
          </View>
          <Text style={s.brand}>Umeed</Text>
          <Text style={s.tagline}>Campus Welfare & Issue Management</Text>
        </View>

        <View style={[s.card, shadow]}>
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.sub}>Log in to your account</Text>
          <Input icon="mail-outline" placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Input icon="lock-closed-outline" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <Button title="Login" onPress={onLogin} loading={busy} />
          {USE_MOCK ? <Text style={s.hint}>Demo mode: any email and password will work</Text> : null}
          <Text style={s.footer}>
            Don't have an account? <Link href="/register" style={s.link}>Register</Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: colors.primary, paddingTop: 90, paddingBottom: 80, alignItems: "center", borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  logoCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: colors.secondary },
  logo: { fontSize: 30, color: colors.primary, fontWeight: "700" },
  brand: { fontSize: 30, fontWeight: "800", color: colors.white, marginTop: 14 },
  tagline: { color: colors.primarySoft, marginTop: 4, fontSize: 13 },
  card: { backgroundColor: colors.white, marginHorizontal: 20, marginTop: -40, borderRadius: radius.xl, padding: 22 },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  sub: { color: colors.muted, marginBottom: 20, marginTop: 4 },
  hint: { textAlign: "center", color: colors.muted, fontSize: 12, marginTop: 12 },
  footer: { textAlign: "center", color: colors.muted, marginTop: 20 },
  link: { color: colors.primary, fontWeight: "700" },
});
