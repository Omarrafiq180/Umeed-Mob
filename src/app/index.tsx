import { Redirect } from "expo-router";
import { View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../components/States";

// App entry point: go to Home if logged in, otherwise to Login
export default function Index() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Loading />
      </View>
    );
  }
  return <Redirect href={user ? "/home" : "/login"} />;
}
