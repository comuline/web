import { SetState } from "@/utils";
import React from "react";

export const usePersistedState = <T>(key: string, initialValues: T) => {
  const [state, setState] = React.useState<T>(() => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return initialValues;
      return JSON.parse(data) as T;
    } catch (err) {
      localStorage.removeItem(key);
      console.error("Error parsing saved form data:", err);
      return initialValues;
    }
  });

  React.useEffect(() => {
    if (state) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState] satisfies [T, SetState<T>];
};
