import { getMisses } from "@/lib/kv";
import { HomeContent } from "@/components/HomeContent";

export const revalidate = 60; // Cache for 60 seconds - handles viral traffic

export default async function HomePage() {
  const misses = await getMisses();

  return <HomeContent initialMisses={misses} />;
}
