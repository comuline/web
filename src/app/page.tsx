import MainPage from "@/commons/ui/pages/home";
import { redirect } from "next/navigation";

export default async function Home() {
  if (process.env.REDIRECT === "true")
    return redirect("https://www.comuline.com");
  return <MainPage />;
}
