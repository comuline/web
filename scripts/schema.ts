import { $ } from "bun";

try {
  const COMULINE_API_URL = process.env.COMULINE_API_URL;
  if (!COMULINE_API_URL) throw new Error("COMULINE_API_URL is not set");
  const output =
    await $`openapi-typescript ${COMULINE_API_URL}/openapi -o src/schema.d.ts`.text();
  console.log(output);
} catch (err) {
  console.log(`Failed with code ${err.exitCode}`);
  console.log(err.stdout.toString());
  console.log(err.stderr.toString());
}
