import type { Metadata } from "next";
import "../globals.css";
import SiteShell from "@/components/SiteShell";
import { rootMetadata } from "@/lib/metadata";

/* Turkish is the site at the root: this is a Turkish company on its own
   domain, and the front door should be the site, not a redirect. English
   lives under /en with its own root layout in app/(en). */
export const metadata: Metadata = rootMetadata("tr");

export default function TrLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="tr">{children}</SiteShell>;
}
