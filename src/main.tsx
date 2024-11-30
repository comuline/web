import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./index.css";
import { SWRConfig } from "swr";
import { createKey } from "./utils/key";

function localStorageProvider(): Map<string, any> {
  const key = createKey(["cache"]);
  const map = new Map<string, any>(
    JSON.parse(localStorage.getItem(key) || "[]"),
  );

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(key, appCache);
  });

  return map;
}

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <SWRConfig value={{ provider: localStorageProvider }}>
      <App />
    </SWRConfig>
  </React.StrictMode>,
);
