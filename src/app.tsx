import createClient from "openapi-fetch";
import { useState } from "preact/hooks";
import { paths } from "./schema";
import { createQueryHook } from "swr-openapi";

const client = createClient<paths>({
  baseUrl: "https://comuline-api.zulio.workers.dev/",
});

const useStations = createQueryHook(client, "stations");

export function App() {
  const [count, setCount] = useState(0);

  const { data } = useStations("/v1/station");

  return (
    <div class="bg-black text-white">
      <h1 class="bg-black">Vite + Preact</h1>
      <pre>{JSON.stringify(data?.data, null, 2)}</pre>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <p>
        Check out{" "}
        <a
          href="https://preactjs.com/guide/v10/getting-started#create-a-vite-powered-preact-app"
          target="_blank"
        >
          create-preact
        </a>
        , the official Preact + Vite starter
      </p>
      <p class="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
    </div>
  );
}
