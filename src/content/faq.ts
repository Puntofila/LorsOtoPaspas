import type { Locale } from "@/lib/i18n/config";

export type FaqItem = { q: string; a: string };

type FaqMap = Partial<Record<Locale, FaqItem[]>>;

/** tr + en written in full; ru provided; ar falls back to en via getFaq(). */
const FAQ: FaqMap = {
  tr: [
    {
      q: "Paspaslar aracıma tam uyacak mı?",
      a: "Evet. Her set, araç modeline özel kalıpla, milimetrik hassasiyetle kesilir. Sipariş verirken markanı ve modelini seçmen yeterli.",
    },
    {
      q: "Hangi set tiplerini sunuyorsunuz?",
      a: "Ön (2 parça), Tam Set (4 parça) ve Tam Set + Bagaj (5 parça) seçenekleri mevcuttur. Uygunluk modele göre değişebilir.",
    },
    {
      q: "Logo veya kişisel yazı ekleyebilir miyim?",
      a: "Evet. Ürün sayfasında marka logosu veya kişisel yazı seçeneğini ekleyebilirsin. Bu seçenekler özel üretim olarak hazırlanır.",
    },
    {
      q: "Üretim ve teslimat ne kadar sürer?",
      a: "Standart üretim 2–4 iş günü, teslimat 1–3 iş günüdür. Logolu setlerde süre biraz uzayabilir.",
    },
    {
      q: "Kargo ücretli mi?",
      a: "Hayır, tüm yurt içi siparişlerde kargo ücretsizdir.",
    },
    {
      q: "İade yapabilir miyim?",
      a: "Standart ürünlerde 14 gün içinde iade hakkın vardır. Kişiselleştirilmiş ürünler ayıplı olmadıkça iade edilemez.",
    },
    {
      q: "Paspasları nasıl temizlerim?",
      a: "Yüzey kolay temizlenir; ılık su ve yumuşak deterjanla silmen yeterlidir. Yüksek basınçlı yıkamadan kaçın.",
    },
  ],
  en: [
    {
      q: "Will the mats fit my car exactly?",
      a: "Yes. Every set is cut from a model-specific pattern with millimetric precision. Just pick your brand and model when ordering.",
    },
    {
      q: "Which set types do you offer?",
      a: "Front (2 pcs), Full Set (4 pcs) and Full Set + Trunk (5 pcs). Availability can vary by model.",
    },
    {
      q: "Can I add a logo or custom text?",
      a: "Yes. On the product page you can add a brand logo or custom text. These options are made to order.",
    },
    {
      q: "How long do production and delivery take?",
      a: "Standard production is 2–4 business days and delivery is 1–3 business days. Logo sets may take slightly longer.",
    },
    {
      q: "Is shipping paid?",
      a: "No — shipping is free on all domestic orders.",
    },
    {
      q: "Can I return my order?",
      a: "Standard products can be returned within 14 days. Personalized products can't be returned unless defective.",
    },
    {
      q: "How do I clean the mats?",
      a: "The surface cleans easily — just wipe with warm water and a mild detergent. Avoid high-pressure washing.",
    },
  ],
  ru: [
    {
      q: "Коврики точно подойдут моему авто?",
      a: "Да. Каждый комплект вырезан по лекалу конкретной модели с миллиметровой точностью. При заказе просто выберите марку и модель.",
    },
    {
      q: "Какие типы комплектов вы предлагаете?",
      a: "Передние (2 шт), Полный комплект (4 шт) и Полный + багажник (5 шт). Доступность зависит от модели.",
    },
    {
      q: "Можно добавить логотип или надпись?",
      a: "Да. На странице товара можно добавить логотип марки или свою надпись. Эти опции изготавливаются под заказ.",
    },
    {
      q: "Сколько занимает производство и доставка?",
      a: "Стандартное производство — 2–4 рабочих дня, доставка — 1–3 рабочих дня. Комплекты с логотипом могут занять чуть дольше.",
    },
    {
      q: "Доставка платная?",
      a: "Нет, доставка бесплатна по всем внутренним заказам.",
    },
    {
      q: "Можно вернуть заказ?",
      a: "Стандартные товары можно вернуть в течение 14 дней. Персонализированные товары не подлежат возврату, кроме случаев брака.",
    },
    {
      q: "Как чистить коврики?",
      a: "Поверхность легко моется — протрите тёплой водой с мягким моющим средством. Избегайте мойки под высоким давлением.",
    },
  ],
};

export function getFaq(locale: Locale): FaqItem[] {
  return FAQ[locale] ?? FAQ.en ?? FAQ.tr!;
}
