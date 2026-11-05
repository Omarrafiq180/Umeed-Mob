import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { errorMessage } from "../api/client";

// Loads data when the screen opens and refreshes it when you come back to the screen
export function useLoad<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setData(await fn());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { data, loading, error, reload: load };
}
