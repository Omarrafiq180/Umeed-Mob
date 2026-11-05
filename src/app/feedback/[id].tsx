import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";
import { errorMessage } from "../../api/client";
import { complaintService } from "../../services";
import ScreenHeader from "../../components/ScreenHeader";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Feedback() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!rating) return Alert.alert("Rating missing", "Please choose a star rating first.");
    try {
      setBusy(true);
      await complaintService.feedback(id, rating, text.trim());
      Alert.alert("Thank you!", "Your feedback is valuable to us.", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e) {
      Alert.alert("Feedback could not be sent", errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader back title="Feedback & Rating" subtitle="How was the work?" />
      <View style={{ padding: 20 }}>
        <View style={s.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} onPress={() => setRating(n)} hitSlop={6}>
              <Ionicons name={n <= rating ? "star" : "star-outline"} size={44} color={colors.secondary} />
            </Pressable>
          ))}
        </View>
        <Input multiline placeholder="Write your feedback (optional)" value={text} onChangeText={setText} />
        <Button title="Submit" onPress={submit} loading={busy} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({ stars: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 24 } });
