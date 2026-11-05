import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { Link, useRouter } from "expo-router";
import { colors } from "../constants/theme";
import { errorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", studentId: "", department: "", phone: "" });
  const set = (key: string) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onRegister = async () => {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6)
      return Alert.alert("Missing details", "Name, email and a password of at least 6 characters are required.");
    try {
      setBusy(true);
      await register({ ...form, email: form.email.trim(), name: form.name.trim() });
      router.replace("/home");
    } catch (e) {
      Alert.alert("Registration failed", errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Create account</Text>
      <Text style={s.sub}>Register as a student</Text>
      <Input icon="person-outline" placeholder="Full name" value={form.name} onChangeText={set("name")} />
      <Input icon="mail-outline" placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={set("email")} />
      <Input icon="lock-closed-outline" placeholder="Password (min 6 characters)" secureTextEntry value={form.password} onChangeText={set("password")} />
      <Input icon="card-outline" placeholder="Student ID" value={form.studentId} onChangeText={set("studentId")} />
      <Input icon="school-outline" placeholder="Department" value={form.department} onChangeText={set("department")} />
      <Input icon="call-outline" placeholder="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={set("phone")} />
      <Button title="Register" onPress={onRegister} loading={busy} />
      <Text style={s.footer}>
        Already have an account? <Link href="/login" style={s.link}>Log in</Link>
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 24, paddingTop: 70 },
  title: { fontSize: 26, fontWeight: "800", color: colors.ink },
  sub: { color: colors.muted, marginTop: 4, marginBottom: 24 },
  footer: { textAlign: "center", color: colors.muted, marginTop: 20 },
  link: { color: colors.primary, fontWeight: "700" },
});
