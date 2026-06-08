export const COMPANY_NAME = "LORS OTO PASPAS";

export const COMPANY_DESCRIPTION_TR =
  "LORS OTO PASPAS Türkiye'nin en yeni araç paspası. Bol renk seçeneğiyle tüm marka ve model araca özel üretim. El yapımı. Su ve tozu hapseden havuzcuk sistemine sahiptir. Kokmaz, sarkmaz, yırtılmaz, yerinden kaymaz ve zemini tamamen kaplar. Kolay temizlenir. 1 yıl garantilidir.";

export type Branch = {
  id: string;
  name: string;
  shortName: string;
  address: string;
  phone: string;
  mapsUrl: string;
  hours: { days: string; hours: string }[];
};

export const COMPANY_PROFILE: {
  name: string;
  description: string;
  warrantyYears: number;
  branches: Branch[];
} = {
  name: COMPANY_NAME,
  description: COMPANY_DESCRIPTION_TR,
  warrantyYears: 1,
  branches: [
    {
      id: "basaksehir-gokova",
      name: "Başakşehir Şubesi / Gökova",
      shortName: "Başakşehir / Gökova",
      address: "Başakşehir, Gökova Cd No:75, 34490 Başakşehir/İstanbul, Türkiye",
      phone: "+90 552 888 95 95",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Başakşehir%2C%20Gökova%20Cd%20No%3A75%2C%2034490%20Başakşehir%2Fİstanbul",
      hours: [
        { days: "Pazartesi–Perşembe", hours: "09:00–19:00" },
        { days: "Cuma", hours: "14:00–19:00" },
        { days: "Cumartesi–Pazar", hours: "09:00–19:00" },
      ],
    },
    {
      id: "ikitelli-sefakoy",
      name: "İkitelli / Sefaköy Şubesi",
      shortName: "İkitelli / Sefaköy",
      address: "İkitelli OSB, Sefaköy Sanayi Sitesi, 34490 Başakşehir/İstanbul, Türkiye",
      phone: "+90 555 864 95 95",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=İkitelli%20OSB%2C%20Sefaköy%20Sanayi%20Sitesi%2C%2034490%20Başakşehir%2Fİstanbul",
      hours: [
        { days: "Pazartesi–Cumartesi", hours: "09:00–19:00" },
        { days: "Pazar", hours: "Kapalı" },
      ],
    },
  ],
};

