import type { Locale } from "@/lib/i18n/config";

export type ContentSection = { heading: string; body: string[] };
export type ContentPage = {
  title: string;
  intro: string;
  updated?: string;
  sections: ContentSection[];
};

export type ContentSlug = "about" | "shipping" | "returns" | "terms" | "privacy";

/**
 * NOTE: The legal pages below (terms, privacy, returns) are sensible boilerplate
 * to ship a complete site. They are NOT legal advice — have a lawyer review the
 * wording before going to production in your jurisdiction.
 *
 * tr + en are written in full. ru + ar are provided where practical and fall
 * back to en (then tr) via getContent() so no page ever renders blank.
 */

const UPDATED = "2026-06-01";

type PageMap = Partial<Record<Locale, ContentPage>>;

const about: PageMap = {
  tr: {
    title: "Hakkımızda",
    intro:
      "LORS, aracına birebir uyan premium paspaslar üretir. Her seti, modeline özel kalıplarla, milimetrik hassasiyetle hazırlıyoruz.",
    sections: [
      {
        heading: "Hikayemiz",
        body: [
          "LORS, sürücülerin hak ettiği uyumu ve kaliteyi sunma fikriyle kuruldu. Standart paspasların kaymasından ve kötü oturmasından sıkılan bir ekip olarak, her araç modeli için ayrı kalıp çıkarmaya karar verdik.",
          "Bugün 70'ten fazla marka ve 900'ün üzerinde model için üretim yapıyoruz. Her sipariş, üretimden kalite kontrole ve sevkiyata kadar tek bir hat üzerinde takip ediliyor.",
        ],
      },
      {
        heading: "Değerlerimiz",
        body: [
          "Uyum: Modeline özel kesim, kaymaz zemin ve net kenar kıvrımı.",
          "Kalite: Dört mevsim dayanıklı, kolay temizlenen premium yüzey.",
          "Şeffaflık: Sipariş sürecinin her aşamasında ne olduğunu bilirsin.",
        ],
      },
      {
        heading: "Üretim",
        body: [
          "Paspaslarımız, dayanıklı kauçuk taban ve premium yüzey kombinasyonuyla üretilir. Logolu ve kişisel yazılı seçenekler dahil her set, sevkiyat öncesi kalite kontrolünden geçer.",
        ],
      },
    ],
  },
  en: {
    title: "About Us",
    intro:
      "LORS makes premium mats that fit your car exactly. Every set is built from model-specific patterns with millimetric precision.",
    sections: [
      {
        heading: "Our story",
        body: [
          "LORS was founded on a simple idea: drivers deserve mats that actually fit. Tired of generic mats that slide around and sit poorly, we set out to cut a dedicated pattern for every single vehicle model.",
          "Today we produce for more than 70 brands and over 900 models. Every order is tracked on a single pipeline — from production to quality control to shipping.",
        ],
      },
      {
        heading: "Our values",
        body: [
          "Fit: model-specific cut, anti-slip base and clean edge curves.",
          "Quality: a premium, easy-to-clean surface built for all four seasons.",
          "Transparency: you know exactly what's happening at every step of your order.",
        ],
      },
      {
        heading: "How we make them",
        body: [
          "Our mats combine a durable rubber base with a premium surface. Every set — including branded and custom-text options — passes quality control before it ships.",
        ],
      },
    ],
  },
  ru: {
    title: "О компании",
    intro:
      "LORS производит премиальные коврики, которые точно подходят вашему авто. Каждый комплект изготовлен по лекалам конкретной модели с миллиметровой точностью.",
    sections: [
      {
        heading: "Наша история",
        body: [
          "LORS родился из простой идеи: водители заслуживают коврики, которые действительно подходят. Устав от универсальных ковриков, которые скользят и плохо садятся, мы начали делать отдельное лекало для каждой модели авто.",
          "Сегодня мы производим коврики более чем для 70 марок и свыше 900 моделей. Каждый заказ проходит единый путь — от производства до контроля качества и отгрузки.",
        ],
      },
      {
        heading: "Наши ценности",
        body: [
          "Посадка: крой под конкретную модель, нескользящая основа и аккуратные борта.",
          "Качество: премиальная, легко моющаяся поверхность для всех четырёх сезонов.",
          "Прозрачность: вы точно знаете, что происходит на каждом этапе заказа.",
        ],
      },
      {
        heading: "Как мы производим",
        body: [
          "Наши коврики сочетают прочную резиновую основу и премиальную поверхность. Каждый комплект, включая варианты с логотипом и надписью, проходит контроль качества перед отправкой.",
        ],
      },
    ],
  },
};

const shipping: PageMap = {
  tr: {
    title: "Kargo & Teslimat",
    intro: "Siparişlerini hızlı ve güvenli şekilde adresine ulaştırıyoruz.",
    updated: UPDATED,
    sections: [
      {
        heading: "Üretim süresi",
        body: [
          "Modele özel paspaslar siparişten sonra üretilir. Standart üretim süresi 2–4 iş günüdür. Logolu ve kişisel yazılı setlerde süre 1–2 gün uzayabilir.",
        ],
      },
      {
        heading: "Teslimat süresi",
        body: [
          "Kargoya verildikten sonra teslimat genellikle 1–3 iş günü sürer. Bölgeye göre değişiklik gösterebilir.",
        ],
      },
      {
        heading: "Kargo ücreti",
        body: ["Tüm yurt içi siparişlerde kargo ücretsizdir."],
      },
      {
        heading: "Sipariş takibi",
        body: [
          "Siparişin kargoya verildiğinde bilgilendirilirsin. Hesabım sayfasından sipariş durumunu takip edebilirsin.",
        ],
      },
    ],
  },
  en: {
    title: "Shipping & Delivery",
    intro: "We get your order to your door quickly and safely.",
    updated: UPDATED,
    sections: [
      {
        heading: "Production time",
        body: [
          "Model-specific mats are made to order. Standard production takes 2–4 business days. Branded or custom-text sets may add 1–2 days.",
        ],
      },
      {
        heading: "Delivery time",
        body: [
          "Once shipped, delivery usually takes 1–3 business days, depending on your region.",
        ],
      },
      {
        heading: "Shipping cost",
        body: ["Shipping is free on all domestic orders."],
      },
      {
        heading: "Order tracking",
        body: [
          "You'll be notified when your order ships. You can follow its status from your Account page.",
        ],
      },
    ],
  },
  ru: {
    title: "Доставка",
    intro: "Доставляем заказы быстро и безопасно прямо к вашей двери.",
    updated: UPDATED,
    sections: [
      {
        heading: "Срок производства",
        body: [
          "Коврики под модель изготавливаются под заказ. Стандартный срок производства — 2–4 рабочих дня. Комплекты с логотипом или надписью могут добавить 1–2 дня.",
        ],
      },
      {
        heading: "Срок доставки",
        body: [
          "После отправки доставка обычно занимает 1–3 рабочих дня в зависимости от региона.",
        ],
      },
      { heading: "Стоимость доставки", body: ["Доставка бесплатна по всем внутренним заказам."] },
      {
        heading: "Отслеживание заказа",
        body: [
          "Вы получите уведомление об отправке. Статус заказа можно отслеживать в разделе «Аккаунт».",
        ],
      },
    ],
  },
};

const returns: PageMap = {
  tr: {
    title: "İade & Değişim",
    intro: "Memnuniyetin bizim için önemli. İade ve değişim koşulları aşağıdadır.",
    updated: UPDATED,
    sections: [
      {
        heading: "İade süresi",
        body: [
          "Standart ürünlerde teslimattan itibaren 14 gün içinde iade hakkın vardır. Ürün kullanılmamış ve orijinal ambalajında olmalıdır.",
        ],
      },
      {
        heading: "Kişiselleştirilmiş ürünler",
        body: [
          "Logolu veya kişisel yazılı (özel üretim) setler, ayıplı/kusurlu olmadıkça iade edilemez.",
        ],
      },
      {
        heading: "Değişim",
        body: [
          "Yanlış model veya hatalı set durumunda ücretsiz değişim sağlanır. Bizimle iletişime geçmen yeterli.",
        ],
      },
      {
        heading: "İade nasıl yapılır?",
        body: [
          "İletişim sayfasından sipariş numaranla bize ulaş; iade sürecini birlikte başlatalım.",
        ],
      },
    ],
  },
  en: {
    title: "Returns & Exchanges",
    intro: "Your satisfaction matters. Here are our return and exchange terms.",
    updated: UPDATED,
    sections: [
      {
        heading: "Return window",
        body: [
          "Standard products can be returned within 14 days of delivery. Items must be unused and in their original packaging.",
        ],
      },
      {
        heading: "Personalized products",
        body: [
          "Branded or custom-text (made-to-order) sets cannot be returned unless they are defective.",
        ],
      },
      {
        heading: "Exchanges",
        body: [
          "If the wrong model or set was sent, we'll exchange it free of charge — just reach out to us.",
        ],
      },
      {
        heading: "How to return",
        body: [
          "Contact us via the Contact page with your order number and we'll start the return together.",
        ],
      },
    ],
  },
  ru: {
    title: "Возврат и обмен",
    intro: "Ваша удовлетворённость важна для нас. Ниже — условия возврата и обмена.",
    updated: UPDATED,
    sections: [
      {
        heading: "Срок возврата",
        body: [
          "Стандартные товары можно вернуть в течение 14 дней с момента доставки. Товар должен быть неиспользованным и в оригинальной упаковке.",
        ],
      },
      {
        heading: "Персонализированные товары",
        body: [
          "Комплекты с логотипом или надписью (изготовленные под заказ) не подлежат возврату, кроме случаев брака.",
        ],
      },
      {
        heading: "Обмен",
        body: [
          "Если отправлена не та модель или комплект, мы обменяем бесплатно — просто свяжитесь с нами.",
        ],
      },
      {
        heading: "Как оформить возврат",
        body: [
          "Напишите нам через страницу «Контакты» с номером заказа, и мы начнём процесс возврата вместе.",
        ],
      },
    ],
  },
};

const terms: PageMap = {
  tr: {
    title: "Kullanım Koşulları",
    intro: "Bu sitenin ve hizmetlerimizin kullanımına ilişkin koşullar.",
    updated: UPDATED,
    sections: [
      {
        heading: "Genel",
        body: [
          "Bu siteyi kullanarak aşağıdaki koşulları kabul etmiş olursun. Koşulları zaman zaman güncelleyebiliriz; güncel sürüm bu sayfada yayınlanır.",
        ],
      },
      {
        heading: "Siparişler",
        body: [
          "Sipariş vermek bir satın alma teklifidir. Onay ve üretim öncesinde stok ve uygunluk durumunu kontrol ederiz. Fiyatlar ve ürün bilgileri bildirim yapılmaksızın değişebilir.",
        ],
      },
      {
        heading: "Fikri mülkiyet",
        body: [
          "Sitedeki tüm içerik, tasarım ve markalar LORS'a veya ilgili sahiplerine aittir ve izinsiz kullanılamaz.",
        ],
      },
      {
        heading: "Sorumluluk",
        body: [
          "Ürünlerimizi mümkün olan en yüksek özenle üretiriz. Yasaların izin verdiği ölçüde, dolaylı zararlardan sorumlu tutulamayız.",
        ],
      },
    ],
  },
  en: {
    title: "Terms of Use",
    intro: "The terms that govern your use of this site and our services.",
    updated: UPDATED,
    sections: [
      {
        heading: "General",
        body: [
          "By using this site you agree to the terms below. We may update these terms from time to time; the current version is always published on this page.",
        ],
      },
      {
        heading: "Orders",
        body: [
          "Placing an order is an offer to purchase. We confirm stock and suitability before production. Prices and product details may change without notice.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "All content, designs and marks on this site belong to LORS or their respective owners and may not be used without permission.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "We make our products with the greatest possible care. To the extent permitted by law, we are not liable for indirect damages.",
        ],
      },
    ],
  },
};

const privacy: PageMap = {
  tr: {
    title: "Gizlilik Politikası",
    intro: "Kişisel verilerini nasıl topladığımızı ve koruduğumuzu açıklarız.",
    updated: UPDATED,
    sections: [
      {
        heading: "Topladığımız veriler",
        body: [
          "Hesap ve sipariş için ad, e-posta, telefon ve teslimat adresi gibi bilgileri toplarız. Ödeme bilgileri tarafımızca saklanmaz.",
        ],
      },
      {
        heading: "Kullanım amacı",
        body: [
          "Verilerini siparişleri işlemek, sana ulaşmak ve hizmetimizi geliştirmek için kullanırız. İznin olmadan üçüncü taraflarla pazarlama amaçlı paylaşmayız.",
        ],
      },
      {
        heading: "Çerezler",
        body: [
          "Dil ve tema tercihini hatırlamak için temel çerezler kullanırız. Tarayıcından çerezleri yönetebilirsin.",
        ],
      },
      {
        heading: "Haklarının kullanımı",
        body: [
          "Verilerine erişme, düzeltme veya silinmesini talep etme hakkın vardır. Bunun için bizimle iletişime geçebilirsin.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    intro: "How we collect and protect your personal data.",
    updated: UPDATED,
    sections: [
      {
        heading: "Data we collect",
        body: [
          "For your account and orders we collect details such as name, email, phone and delivery address. Payment details are not stored by us.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use your data to process orders, contact you and improve our service. We don't share it with third parties for marketing without your consent.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "We use essential cookies to remember your language and theme preferences. You can manage cookies in your browser.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access, correct or request deletion of your data. Contact us to exercise these rights.",
        ],
      },
    ],
  },
};

export const CONTENT: Record<ContentSlug, PageMap> = {
  about,
  shipping,
  returns,
  terms,
  privacy,
};

export function getContent(slug: ContentSlug, locale: Locale): ContentPage {
  const map = CONTENT[slug];
  return map[locale] ?? map.en ?? map.tr!;
}

export const CONTENT_SLUGS: ContentSlug[] = ["about", "shipping", "returns", "terms", "privacy"];
