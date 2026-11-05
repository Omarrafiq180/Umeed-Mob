import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES, colors, PRIORITIES, radius } from "../constants/theme";
import { errorMessage } from "../api/client";
import { complaintService, uploadService } from "../services";
import ScreenHeader from "../components/ScreenHeader";
import FilterChips from "../components/FilterChips";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Report() {
  const router = useRouter();
  const [category, setCategory] = useState("Facilities");
  const [priority, setPriority] = useState("Medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultiple: true,
      selectionLimit: 3,
      quality: 0.7,
    });
    if (!res.canceled) setPhotos((p) => [...p, ...res.assets.map((a) => a.uri)].slice(0, 3));
  };

  const submit = async () => {
    if (!title.trim() || !description.trim()) return Alert.alert("Missing details", "Title and description are required.");
    try {
      setBusy(true);
      const images = await uploadService.upload(photos);
      await complaintService.create({
        title: title.trim(), description: description.trim(), category, priority, images,
        location: { building: building.trim(), room: room.trim() },
      });
      Alert.alert("Complaint submitted", "You will be notified about status updates.", [
        { text: "OK", onPress: () => router.replace("/my-issues") },
      ]);
    } catch (e) {
      Alert.alert("Complaint could not be sent", errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader back title="Report Issue" subtitle="Tell us about the campus issue" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={s.label}>Category</Text>
        <FilterChips options={CATEGORIES} selected={category} onSelect={setCategory} />
        <Text style={s.label}>Title</Text>
        <Input icon="create-outline" placeholder="Short summary of the issue" value={title} onChangeText={setTitle} />
        <Text style={s.label}>Description</Text>
        <Input multiline placeholder="Describe the issue in detail..." value={description} onChangeText={setDescription} />
        <Text style={s.label}>Location</Text>
        <Input icon="business-outline" placeholder="Building (e.g. Block B)" value={building} onChangeText={setBuilding} />
        <Input icon="location-outline" placeholder="Room / place" value={room} onChangeText={setRoom} />
        <Text style={s.label}>Priority</Text>
        <FilterChips options={PRIORITIES} selected={priority} onSelect={setPriority} />

        <Text style={s.label}>Photos (max 3)</Text>
        <View style={s.photos}>
          {photos.map((u) => (
            <Pressable key={u} onPress={() => setPhotos((p) => p.filter((x) => x !== u))}>
              <Image source={{ uri: u }} style={s.photo} />
            </Pressable>
          ))}
          {photos.length < 3 ? (
            <Pressable onPress={pick} style={[s.photo, s.add]}>
              <Ionicons name="camera-outline" size={26} color={colors.primary} />
            </Pressable>
          ) : null}
        </View>
        {photos.length ? <Text style={s.hint}>Tap a photo to remove it</Text> : null}

        <View style={{ marginTop: 20 }}>
          <Button title="Submit" onPress={submit} loading={busy} />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontWeight: "800", color: colors.ink, marginBottom: 8, fontSize: 15 },
  photos: { flexDirection: "row", gap: 10 },
  photo: { width: 80, height: 80, borderRadius: radius.md },
  add: { backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: colors.primary, borderStyle: "dashed" },
  hint: { color: colors.muted, fontSize: 11, marginTop: 6 },
});
