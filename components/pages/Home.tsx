import { type Locale } from "@/lib/i18n";
import Corridor from "@/components/home/Corridor";
import Hero from "@/components/home/Hero";
import NameMarquee from "@/components/home/NameMarquee";
import Intro from "@/components/home/Intro";
import Compare from "@/components/home/Compare";
import Families from "@/components/home/Families";
import Drape from "@/components/home/Drape";
import Warehouse from "@/components/home/Warehouse";
import Value from "@/components/home/Value";
import Process from "@/components/home/Process";
import CallToAction from "@/components/home/CallToAction";

export default function Home({ locale }: { locale: Locale }) {

  return (
    <>
      <Corridor locale={locale} />
      <Hero locale={locale} />
      <NameMarquee />
      <Intro locale={locale} />
      <Compare locale={locale} />
      <Families locale={locale} />
      <Drape locale={locale} />
      <Warehouse locale={locale} />
      <Value locale={locale} />
      <Process locale={locale} />
      <CallToAction locale={locale} />
    </>
  );
}
