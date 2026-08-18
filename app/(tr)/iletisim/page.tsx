import type { Metadata } from "next";
import Contact from "@/components/pages/Contact";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("tr", "contact");

export default function Page() {
  return <Contact locale="tr" />;
}
