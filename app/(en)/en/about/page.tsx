import type { Metadata } from "next";
import About from "@/components/pages/About";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata("en", "about");

export default function Page() {
  return <About locale="en" />;
}
