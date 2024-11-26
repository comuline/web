import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./index.css";
import { SWRConfig } from "swr";

function localStorageProvider(): Map<string, any> {
  const map = new Map<string, any>(
    JSON.parse(localStorage.getItem("comuline-cache") || "[]"),
  );

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("comuline-cache", appCache);
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
