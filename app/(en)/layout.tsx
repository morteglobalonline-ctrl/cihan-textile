import type { Metadata } from "next";
import "../globals.css";
import SiteShell from "@/components/SiteShell";
import { rootMetadata } from "@/lib/metadata";

/* English is a section under /en, with its own root layout so the document
   can carry lang="en". Switching language crosses root layouts, which is a
   full page load — fine for something done once per visit. */
export const metadata: Metadata = rootMetadata("en");

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
