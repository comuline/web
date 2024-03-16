import MainPage from "@/commons/ui/pages/home";
import { env } from "@/env";
import { redirect } from "next/navigation";

export default async function Home() {
  if (env.NODE_ENV === "production")
    return redirect("https://www.comuline.com");
  return <MainPage />;
}
