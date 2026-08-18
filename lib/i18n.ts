export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export const COMPANY = {
  name: "Cihan Textile",
  legalTr: "Cihan Tekstil",
  incorporated: 1998,
  legalFull: "Cihan Tekstil Nakliye Turizm Sanayi Ticaret Ltd. Şti.",
  address: {
    line1: "Altınova Mah. İstanbul Cad.",
    line2: "Buttim İş Merkezi A Blok Kat: 4 No: 4014",
    city: "Osmangazi / Bursa",
    country: { tr: "Türkiye", en: "Türkiye" },
  },
  phone: "+90 224 211 28 81",
  phoneHref: "+902242112881",
  fax: "+90 224 221 28 80",
  whatsapp: "+90 532 138 43 22",
  whatsappHref: "905321384322",
  email: "cihan@cihantextile.com",
} as const;

type Dict = {
  meta: { title: string; description: string };
  nav: {
    home: string;
    catalog: string;
    about: string;
    contact: string;
    menu: string;
    close: string;
    langLabel: string;
  };
  hero: {
    eyebrow: string;
    line1: string;
    line2: string;
    lead: string;
    ctaCatalog: string;
    ctaSample: string;
    scroll: string;
  };
  stats: { value: string; label: string }[];
  intro: { heading: string; body: string[] };
  compare: {
    eyebrow: string;
    heading: string;
    lead: string;
    greigeLabel: string;
    printedLabel: string;
    note: string;
    slider: string;
  };
  warehouse: {
    eyebrow: string;
    heading: string;
    lead: string;
    caption: string;
  };
  families: { eyebrow: string; heading: string; lead: string; cta: string };
  drape: {
    eyebrow: string;
    heading: string;
    lead: string;
    items: { name: string; note: string }[];
  };
  value: {
    eyebrow: string;
    heading: string;
    items: { title: string; body: string }[];
  };
  process: {
    eyebrow: string;
    heading: string;
    steps: { title: string; body: string }[];
  };
  catalog: {
    eyebrow: string;
    heading: string;
    lead: string;
    search: string;
    searchPlaceholder: string;
    family: string;
    fiber: string;
    all: string;
    pfdOnly: string;
    results: string;
    empty: string;
    emptyHint: string;
    reset: string;
    colName: string;
    colBlend: string;
    colGsm: string;
    colWidth: string;
    colFinish: string;
    pfd: string;
    greige: string;
    pfdFull: string;
    note: string;
    askAbout: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    lead: string;
    body: string[];
    timeline: { year: string; title: string; body: string }[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    lead: string;
    addressLabel: string;
    phoneLabel: string;
    faxLabel: string;
    emailLabel: string;
    whatsappLabel: string;
    whatsappCta: string;
    whatsappMessage: string;
    hours: string;
    hoursValue: string;
  };
  cta: { heading: string; body: string; button: string; secondary: string };
  footer: { tagline: string; rights: string; products: string; company: string };
};

const tr: Dict = {
  meta: {
    title: "Cihan Textile — Ham Kumaş ve PFD Tedariki",
    description:
      "Bursa'dan ham kumaş ve baskıya hazır kumaş tedariki. Şifon, krep, saten, poplin, viskon ve mikro grupları; depodan stoklu ve proforma bazlı satış.",
  },
  nav: {
    home: "Ana Sayfa",
    catalog: "Kumaşlar",
    about: "Kurumsal",
    contact: "İletişim",
    menu: "Menü",
    close: "Kapat",
    langLabel: "Dil seçimi",
  },
  hero: {
    eyebrow: "Ham kumaş ve baskıya hazır kumaş · Bursa",
    line1: "Her baskının",
    line2: "başladığı yer",
    lead: "Boyanmamış, basılmamış, işlenmemiş. Biz zinciri en baştan besliyoruz: baskıcının, boyacının ve konfeksiyoncunun üzerine çalışacağı beyaz zemini. Çok satan kaliteler depomuzda hazır bekliyor.",
    ctaCatalog: "Kumaşları incele",
    ctaSample: "Numune iste",
    scroll: "Aşağı kaydır",
  },
  stats: [
    { value: "1998", label: "Aile şirketiyiz" },
    { value: "148–185", label: "cm standart en" },
    { value: "Depodan", label: "stoklu sevkiyat" },
    { value: "Proforma", label: "bazlı ithalat" },
  ],
  intro: {
    heading:
      "Ham kumaş ve PFD ithal eder, Türkiye içinde toptan dağıtırız.",
    body: [
      "Ürünümüz bir gömlek ya da elbise değil; onların yapılacağı top kumaştır — 148–185 cm eninde, boyaya ve baskıya hazır.",
      "Müşterimiz baskıcı, boyacı, apreci ve ihracat yapan konfeksiyoncudur. Onların bizden beklediği tek şey vardır: doğru gramaj, doğru en, sözü verilen günde.",
    ],
  },
  compare: {
    eyebrow: "İşin özeti",
    heading: "Biz solu satarız. Sağını müşterimiz yapar.",
    lead: "İki fotoğraf da aynı krep kumaş. Soldaki bizim depomuzdan çıkan hâli: boyanmamış, basılmamış. Sağdaki, baskıcı müşterimizin onun üzerine yaptığı iş. Aradaki mesafe bizim işimizin tarifi.",
    greigeLabel: "Ham — bizim sattığımız",
    printedLabel: "Baskılı — müşterimizin yaptığı",
    note: "Cihan Textile baskılı kumaş satmaz. Buradaki baskılı örnekler, tedarik ettiğimiz zeminin ne olabileceğini göstermek için yıllar içinde çektirdiğimiz numunelerdir.",
    slider: "Ham ve baskılı görünüm arasında geçiş yapın",
  },
  warehouse: {
    eyebrow: "Bursa deposu",
    heading: "Stok bir iddia değil, bir yerdir",
    lead: "Çok satan kalitelerimizi burada, Bursa'daki depomuzda tutarız. \"Elimizde var\" dediğimizde kastettiğimiz budur: raf raf top kumaş, sevkiyata hazır.",
    caption: "Cihan Textile deposu — Buttim, Bursa",
  },
  families: {
    eyebrow: "Ürün grupları",
    heading: "Kumaş gruplarımız",
    lead: "Pamuktan polyester mikroya kadar. Her kalitenin gramajı ve eni katalogda açıkça yazılıdır — telefonda sorulacak bir şey bırakmıyoruz.",
    cta: "Tüm kataloğu aç",
  },
  drape: {
    eyebrow: "Döküm",
    heading: "Gramaj bir sayıdır. Döküm elde anlaşılır.",
    lead: "Aynı gramajda iki kumaş bambaşka dökülebilir. Aşağıdaki üç zemin de boyanmamış hâliyle, aynı koşulda çekildi — aradaki farkı görmek için.",
    items: [
      { name: "Şifon", note: "En hafif zemin. Işığı geçirir, gövdesiz ve akışkan döker." },
      { name: "Saten", note: "Yüzeyi parlak, ağırlığı belli. Katlanırken yumuşak ve dolgun kıvrımlar verir." },
      { name: "Krep", note: "Mat ve hafif dokulu. Gövdesini korur, keskin kırım tutar." },
    ],
  },
  value: {
    eyebrow: "Neden Cihan",
    heading: "Bu işte fark, kumaşta değil termindedir",
    items: [
      {
        title: "Depodan stoklu satış",
        body: "Çok satan kalitelerimizi Bursa'daki depomuzda stoklu tutarız. Acil işiniz için üç ay beklemek zorunda değilsiniz — top hazırsa aynı hafta yola çıkar.",
      },
      {
        title: "Proforma bazlı ithalat",
        body: "Programlı ve büyük hacimli ihtiyaçlarınızı proforma ile bağlarız. Miktar netleştiğinde fiyat da termin de sabitlenir; sürprizle karşılaşmazsınız.",
      },
      {
        title: "Sevkiyat öncesi kalite kontrol",
        body: "Her parti depodan çıkmadan önce gramaj, en ve yüzey kontrolünden geçer. Baskıya girmiş bir kumaşın kusuru artık sizin sorununuz olur — o yüzden burada yakalarız.",
      },
      {
        title: "İki kuşaklık ticaret",
        body: "İş dedemizin manifatura dükkanında başladı, 1998'de ikinci kuşak ithalata yöneldi. Hiç imalata girmedik; hep kumaş ticareti yaptık ve tedarikçilerimizi o kadar zamandır tanıyoruz.",
      },
    ],
  },
  process: {
    eyebrow: "Nasıl çalışıyoruz",
    heading: "Talepten sevkiyata",
    steps: [
      {
        title: "Talebinizi iletin",
        body: "Kalite adını biliyorsanız doğrudan yazın. Bilmiyorsanız gramaj, en ve kullanım alanını söyleyin — biz eşleştirelim.",
      },
      {
        title: "Numune",
        body: "Karar vermeden önce kumaşı elinizde görün. Numuneyi kargoyla gönderiyoruz.",
      },
      {
        title: "Stok mu, proforma mı",
        body: "Depoda varsa fiyat ve miktarı hemen teyit ederiz. Yoksa proforma açar, termini birlikte belirleriz.",
      },
      {
        title: "Kontrol ve sevkiyat",
        body: "Parti kalite kontrolünden geçer, sonra yola çıkar. Sevkiyat evrakları ve ölçüleri sizinle paylaşılır.",
      },
    ],
  },
  catalog: {
    eyebrow: "Katalog",
    heading: "Kumaş kataloğu",
    lead: "Kaliteler, gramajı ve eniyle. Aramak, süzmek ve karşılaştırmak için tasarlandı.",
    search: "Ara",
    searchPlaceholder: "Kalite adı ara — saten, krep, poplin…",
    family: "Aile",
    fiber: "Elyaf",
    all: "Tümü",
    pfdOnly: "Yalnızca PFD",
    results: "kalite",
    empty: "Bu filtrelerle eşleşen kalite yok.",
    emptyHint: "Filtreleri sıfırlayıp tekrar deneyin.",
    reset: "Filtreleri sıfırla",
    colName: "Kalite",
    colBlend: "Kombinasyon",
    colGsm: "Ağırlık",
    colWidth: "En",
    colFinish: "Durum",
    pfd: "PFD",
    greige: "Ham",
    pfdFull: "PFD — boyaya ve baskıya hazır (Prepared For Dyeing)",
    note: "Gramaj ve en değerleri fabrika toleransındadır. Bağlayıcı değerler için proforma esastır.",
    askAbout: "Bu kalite için teklif iste",
  },
  about: {
    eyebrow: "Kurumsal",
    heading: "Kumaş ticaretinde bir aile şirketi",
    lead: "Kurulduğumuz günden bugüne yaptığımız iş aynı: piyasada talep gören ham kumaşları ithal etmek ve yurt içinde toptan satmak.",
    body: [
      "Cihan Tekstil bir aile şirketidir. Ticaretin temelleri dedemiz Şeyhmus Özgörüş'ün manifatura dükkanında atıldı. O günden bu yana yaptığımız iş değişmedi: biz kumaş satarız. İmalata hiç girmedik.",
      "1998'de ikinci kuşağın eğitimi, vizyonu ve ticari görüşüyle Cihan Tekstil kuruldu. Amaç baştan netti: piyasanın talep ettiği ham kumaşları ithal etmek ve yurt içinde toptan satmak.",
      "Ürünlerimiz ham kumaş ve baskıya hazır kumaş olmak üzere ağırlıklı olarak polyester, pamuk ve viskon çeşitlerinden oluşur. Kalite, fiyat ve termin sıkıntısı yaşamadığımız ürünleri depodan stoklu ve proforma bazında satıyoruz.",
      "Kuruluşumuzdan bugüne müşteri memnuniyeti vazgeçilmezlerimiz arasında oldu. İhracat odaklı çalışan müşterilerimizin yurt dışı pazarında sorunsuz hizmet verebilmesi için kalite yönetim sistemimizi sürekli güncelliyoruz.",
    ],
    timeline: [
      {
        year: "Manifatura",
        title: "Nereden geldik",
        body: "İş, dedemiz Şeyhmus Özgörüş'ün manifatura dükkanında başladı. Kumaş satmak aileden gelir.",
      },
      {
        year: "1998",
        title: "İkinci kuşak",
        body: "Cihan Tekstil kurulur; piyasada talep gören ham kumaşların ithalatı ve yurt içi toptan satışı için.",
      },
      {
        year: "Bugün",
        title: "Buttim, Bursa",
        body: "Merkezimizden Türkiye geneline ham kumaş ve baskıya hazır kumaş tedarik ediyoruz.",
      },
    ],
  },
  contact: {
    eyebrow: "İletişim",
    heading: "Konuşalım",
    lead: "Kalite adı, gramaj ve metraj bilgisiyle yazarsanız aynı gün dönüş yapabiliriz.",
    addressLabel: "Adres",
    phoneLabel: "Telefon",
    faxLabel: "Faks",
    emailLabel: "E-posta",
    whatsappLabel: "WhatsApp",
    whatsappCta: "WhatsApp'tan yazın",
    whatsappMessage: "Merhaba, ham kumaş hakkında bilgi almak istiyorum.",
    hours: "Çalışma saatleri",
    hoursValue: "Pazartesi – Cumartesi, 09:00 – 18:00 (UTC+3)",
  },
  cta: {
    heading: "Aradığınız kaliteyi bulalım",
    body: "Kalite adını bilmiyorsanız sorun değil. Gramajı, eni ve ne iş yapacağınızı söyleyin — kataloğumuzdan eşleştirelim.",
    button: "WhatsApp'tan yazın",
    secondary: "E-posta gönderin",
  },
  footer: {
    tagline: "Ham kumaş ve baskıya hazır kumaş tedariki — Bursa.",
    rights: "Tüm hakları saklıdır.",
    products: "Ürünler",
    company: "Şirket",
  },
};

const en: Dict = {
  meta: {
    title: "Cihan Textile — Greige & PFD Fabric Supply",
    description:
      "Greige and print-ready fabric supplied from Bursa. Chiffon, crepe, satin, poplin, viscose and micro groups; ex-stock and proforma-based sales.",
  },
  nav: {
    home: "Home",
    catalog: "Fabrics",
    about: "Company",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    langLabel: "Language",
  },
  hero: {
    eyebrow: "Greige & print-ready fabric · Bursa",
    line1: "Where every",
    line2: "print begins",
    lead: "Undyed, unprinted, unfinished. We supply the very start of the chain — the white ground a printer, dyer or garment maker builds on. Our fastest-moving qualities are waiting in the warehouse.",
    ctaCatalog: "Browse fabrics",
    ctaSample: "Request a sample",
    scroll: "Scroll",
  },
  stats: [
    { value: "1998", label: "A family company" },
    { value: "148–185", label: "cm standard width" },
    { value: "Ex-stock", label: "warehouse dispatch" },
    { value: "Proforma", label: "based import" },
  ],
  intro: {
    heading:
      "We import greige and PFD fabric and distribute it wholesale across Türkiye.",
    body: [
      "Our product is not a shirt or a dress — it is the roll they are made from: 148–185 cm wide, ready to take dye and print.",
      "Our customers are printers, dyers, finishers and garment exporters. They ask us for one thing: the right weight, at the right width, on the day we promised.",
    ],
  },
  compare: {
    eyebrow: "The business, in one frame",
    heading: "We sell the left. Our customer makes the right.",
    lead: "Both photographs are the same crepe. On the left, as it leaves our warehouse: undyed, unprinted. On the right, what a printer did with it. The distance between the two is exactly what we do.",
    greigeLabel: "Greige — what we sell",
    printedLabel: "Printed — what our customer made",
    note: "Cihan Textile does not sell printed fabric. These printed samples were shot over the years to show what the ground we supply can become.",
    slider: "Wipe between the greige and printed states",
  },
  warehouse: {
    eyebrow: "The Bursa warehouse",
    heading: "Stock is not a claim. It is a place.",
    lead: "Our fastest-moving qualities are held here, in our warehouse in Bursa. This is what we mean when we say it is available: rack after rack of rolls, ready to ship.",
    caption: "Cihan Textile warehouse — Buttim, Bursa",
  },
  families: {
    eyebrow: "Product groups",
    heading: "Our fabric groups",
    lead: "From cotton to polyester micro. Every quality lists its weight and width in the catalogue — nothing left to a phone call.",
    cta: "Open the full catalogue",
  },
  drape: {
    eyebrow: "Drape",
    heading: "Weight is a number. Drape you have to see.",
    lead: "Two fabrics at the same weight can fall completely differently. All three grounds below were shot undyed, under the same conditions — so the difference is visible.",
    items: [
      { name: "Chiffon", note: "The lightest ground. Passes light, falls fluid and without body." },
      { name: "Satin", note: "Lustrous surface, weight you can feel. Folds into soft, full curves." },
      { name: "Crepe", note: "Matte and lightly textured. Holds its body and takes a sharp fold." },
    ],
  },
  value: {
    eyebrow: "Why Cihan",
    heading: "In this trade the difference is not the cloth. It is the delivery date.",
    items: [
      {
        title: "Ex-stock from our warehouse",
        body: "We hold our fastest-moving qualities in stock in Bursa. An urgent order does not mean a three-month wait — if the roll is here, it ships the same week.",
      },
      {
        title: "Proforma-based import",
        body: "Planned and high-volume requirements are committed by proforma. Once the quantity is fixed, so are the price and the delivery date. No surprises later.",
      },
      {
        title: "Quality control before dispatch",
        body: "Every lot is checked for weight, width and surface before it leaves the warehouse. A fault found after printing becomes your problem — so we catch it here.",
      },
      {
        title: "Two generations of trading",
        body: "The business began in our grandfather's draper's shop; the second generation moved into import in 1998. We have never manufactured — only traded cloth — and we have known our mills that long.",
      },
    ],
  },
  process: {
    eyebrow: "How we work",
    heading: "From enquiry to dispatch",
    steps: [
      {
        title: "Send your enquiry",
        body: "If you know the quality name, write it directly. If you don't, tell us the weight, width and end use — we will match it.",
      },
      {
        title: "Sample",
        body: "See the cloth in your hand before you commit. We ship samples by courier.",
      },
      {
        title: "Stock or proforma",
        body: "If it is in the warehouse we confirm price and quantity straight away. If not, we open a proforma and set the delivery date together.",
      },
      {
        title: "Control and dispatch",
        body: "The lot passes quality control, then ships. Shipping documents and measured quantities go out with it.",
      },
    ],
  },
  catalog: {
    eyebrow: "Catalogue",
    heading: "Fabric catalogue",
    lead: "Our qualities, with weight and width. Built to be searched, filtered and compared.",
    search: "Search",
    searchPlaceholder: "Search a quality — satin, crepe, poplin…",
    family: "Family",
    fiber: "Fibre",
    all: "All",
    pfdOnly: "PFD only",
    results: "qualities",
    empty: "No quality matches these filters.",
    emptyHint: "Reset the filters and try again.",
    reset: "Reset filters",
    colName: "Quality",
    colBlend: "Composition",
    colGsm: "Weight",
    colWidth: "Width",
    colFinish: "State",
    pfd: "PFD",
    greige: "Greige",
    pfdFull: "PFD — Prepared For Dyeing, ready to take dye and print",
    note: "Weight and width are within mill tolerance. The proforma is the binding document.",
    askAbout: "Request a quote for this quality",
  },
  about: {
    eyebrow: "Company",
    heading: "A family company in the fabric trade",
    lead: "What we do has not changed since the day we were founded: import the greige fabric the market is asking for, and sell it wholesale on the domestic market.",
    body: [
      "Cihan Tekstil is a family company. The trade began in our grandfather Şeyhmus Özgörüş's draper's shop, and what we do has not changed since: we sell cloth. We have never been manufacturers.",
      "In 1998, with the education, vision and commercial judgement of the second generation, Cihan Tekstil was founded — to import the greige fabric the market is asking for and to sell it wholesale on the domestic market.",
      "Our range is greige and print-ready fabric, predominantly in polyester, cotton and viscose. We sell ex-stock and on a proforma basis the qualities where we have no trouble with quality, price or delivery.",
      "Customer satisfaction has been non-negotiable since the day we opened. For customers working towards export, we keep our quality management system continuously up to date so their service abroad is never interrupted.",
    ],
    timeline: [
      {
        year: "Drapery",
        title: "Where we come from",
        body: "The trade began in our grandfather Şeyhmus Özgörüş's draper's shop. Selling cloth runs in the family.",
      },
      {
        year: "1998",
        title: "Second generation",
        body: "Cihan Tekstil is founded, to import the greige fabric the market is asking for and sell it wholesale.",
      },
      {
        year: "Today",
        title: "Buttim, Bursa",
        body: "From our base we supply greige and print-ready fabric across Türkiye.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Let's talk",
    lead: "Write with the quality name, weight and quantity and we can usually come back the same day.",
    addressLabel: "Address",
    phoneLabel: "Phone",
    faxLabel: "Fax",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    whatsappCta: "Message on WhatsApp",
    whatsappMessage: "Hello, I would like information about your greige fabrics.",
    hours: "Office hours",
    hoursValue: "Monday – Saturday, 09:00 – 18:00 (UTC+3)",
  },
  cta: {
    heading: "Let's find the quality you need",
    body: "Not sure of the name? Tell us the weight, the width and what it is for — we will match it from the catalogue.",
    button: "Message on WhatsApp",
    secondary: "Send an email",
  },
  footer: {
    tagline: "Greige and print-ready fabric supply — from Bursa.",
    rights: "All rights reserved.",
    products: "Products",
    company: "Company",
  },
};

export const DICT: Record<Locale, Dict> = { tr, en };

export function t(locale: Locale) {
  return DICT[locale];
}
