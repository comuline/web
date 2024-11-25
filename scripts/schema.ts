import { $ } from "bun";

try {
  const VITE_COMULINE_API_URL = process.env.VITE_COMULINE_API_URL;
  if (!VITE_COMULINE_API_URL)
    throw new Error("VITE_COMULINE_API_URL is not set");
  const output =
    await $`openapi-typescript ${VITE_COMULINE_API_URL}/openapi -o src/schema.d.ts`.text();
  console.log(output);
} catch (err) {
  console.log(`Failed with code ${err.exitCode}`);
  console.log(err.stdout.toString());
  console.log(err.stderr.toString());
}
