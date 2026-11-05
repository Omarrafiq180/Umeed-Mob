import { useState } from "react";
import { FlatList, View } from "react-native";
import { colors } from "../../constants/theme";
import { useLoad } from "../../hooks/useLoad";
import { complaintService } from "../../services";
import ScreenHeader from "../../components/ScreenHeader";
import FilterChips from "../../components/FilterChips";
import ComplaintCard from "../../components/ComplaintCard";
import { Empty, ErrorView, Loading } from "../../components/States";

const FILTERS = ["All", "Pending", "In Progress", "Resolved", "Rejected"];

export default function MyIssues() {
  const [filter, setFilter] = useState("All");
  const { data, loading, error, reload } = useLoad(() => complaintService.mine(filter), [filter]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="My Issues" subtitle="All your complaints" />
      <View style={{ paddingHorizontal: 16, paddingTop: 14, flex: 1 }}>
        <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />
        {loading && !data ? <Loading /> : error ? (
          <ErrorView message={error} onRetry={reload} />
        ) : (
          <FlatList
            data={data ?? []}
            keyExtractor={(c) => c._id}
            renderItem={({ item }) => <ComplaintCard item={item} />}
            ListEmptyComponent={<Empty text="No complaints with this filter" />}
            contentContainerStyle={{ paddingBottom: 24 }}
            onRefresh={reload}
            refreshing={false}
          />
        )}
      </View>
    </View>
  );
}
