import type { Metadata } from "next";
import Catalog from "@/components/pages/Catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("tr", "catalog");

export default function Page() {
  return <Catalog locale="tr" />;
}
