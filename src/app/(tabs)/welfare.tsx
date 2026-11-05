import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, WELFARE_TYPES } from "../../constants/theme";
import { errorMessage } from "../../api/client";
import { useLoad } from "../../hooks/useLoad";
import { welfareService } from "../../services";
import ScreenHeader from "../../components/ScreenHeader";
import FilterChips from "../../components/FilterChips";
import Input from "../../components/Input";
import Button from "../../components/Button";
import StatusChip from "../../components/StatusChip";
import { Empty, Loading } from "../../components/States";
import { formatDate } from "../../utils/format";

export default function Welfare() {
  const [type, setType] = useState("Fee Aid");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const { data, loading, reload } = useLoad(() => welfareService.mine());

  const submit = async () => {
    if (details.trim().length < 10) return Alert.alert("Missing details", "Please describe your need in a little more detail.");
    try {
      setBusy(true);
      await welfareService.create({ type, details: details.trim(), documents: [] });
      setDetails("");
      await reload();
      Alert.alert("Request submitted", "Your welfare request has been sent to the admin.");
    } catch (e) {
      Alert.alert("Request could not be sent", errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Welfare" subtitle="Request help" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        <Text style={s.label}>Type of help</Text>
        <FilterChips options={WELFARE_TYPES} selected={type} onSelect={setType} />
        <Text style={s.label}>Details</Text>
        <Input multiline placeholder="Describe your situation and what you need..." value={details} onChangeText={setDetails} />
        <Button title="Submit request" onPress={submit} loading={busy} />

        <Text style={[s.label, { marginTop: 26, fontSize: 17 }]}>My previous requests</Text>
        {loading && !data ? <Loading /> : (data ?? []).length === 0 ? (
          <Empty text="No requests yet" />
        ) : (
          (data ?? []).map((w) => (
            <View key={w._id} style={[s.card, shadow]}>
              <View style={s.row}>
                <Text style={s.type}>{w.type}</Text>
                <StatusChip status={w.status} />
              </View>
              <Text style={s.details}>{w.details}</Text>
              {w.adminNote ? <Text style={s.note}>Admin: {w.adminNote}</Text> : null}
              <Text style={s.time}>{formatDate(w.createdAt)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontWeight: "800", color: colors.ink, marginBottom: 8, fontSize: 15 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  type: { fontWeight: "700", fontSize: 16, color: colors.ink },
  details: { color: colors.muted, marginTop: 6, fontSize: 13 },
  note: { color: colors.primaryDark, marginTop: 8, fontSize: 13, fontWeight: "600" },
  time: { color: colors.muted, fontSize: 11, marginTop: 8 },
});
