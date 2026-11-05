import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "../constants/theme";

type Props = { options: string[]; selected: string; onSelect: (v: string) => void };

export default function FilterChips({ options, selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }} style={{ flexGrow: 0, marginBottom: 12 }}>
      {options.map((o) => {
        const on = o === selected;
        return (
          <Pressable key={o} onPress={() => onSelect(o)} style={[s.chip, on && s.on]}>
            <Text style={[s.text, on && { color: colors.white }]}>{o}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border },
  on: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.ink, fontWeight: "600", fontSize: 13 },
});
