import createClient from "openapi-fetch";
import { paths } from "../schema";

export const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_COMULINE_API_URL,
});
