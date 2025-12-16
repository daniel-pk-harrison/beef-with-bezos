import { getMisses } from "@/lib/kv";
import { HomeContent } from "@/components/HomeContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const misses = await getMisses();

  return <HomeContent initialMisses={misses} />;
}
