export type ProductColor = {
  id: string;
  hex: string;
  label: string;
};

export const PRODUCT_OPTIONS = {
  patterns: [
    { id: "sota", label: "Sota" },
    { id: "romb", label: "Romb" },
  ],
  colors: [
    { id: "black", hex: "#101318", label: "Siyah" },
    { id: "graphite", hex: "#69717f", label: "Grafit" },
    { id: "silver", hex: "#b6bec8", label: "Gümüş" },
    { id: "navy", hex: "#21468b", label: "Lacivert" },
    { id: "blue", hex: "#3165ce", label: "Mavi" },
    { id: "burgundy", hex: "#862636", label: "Bordo" },
    { id: "red", hex: "#df2f32", label: "Kırmızı" },
    { id: "beige", hex: "#ccb895", label: "Bej" },
    { id: "camel", hex: "#b98a4c", label: "Taba" },
    { id: "white", hex: "#f0f1f3", label: "Beyaz" },
    { id: "brown", hex: "#5d3b26", label: "Kahverengi" },
    { id: "tan", hex: "#b78b55", label: "Açık kahve" },
    { id: "yellow", hex: "#ebd33f", label: "Sarı" },
    { id: "turquoise", hex: "#2ca8a4", label: "Turkuaz" },
    { id: "orange", hex: "#df8a19", label: "Turuncu" },
    { id: "green", hex: "#2f8549", label: "Yeşil" },
  ] satisfies ProductColor[],
  materials: [
    { id: "hali", label: "Halı" },
    { id: "ithal", label: "İthal" },
    { id: "premium", label: "Premium" },
    { id: "standart", label: "Standart" },
  ],
  sets: [
    { id: "front", labelKey: "set.front", basePrice: 1290 },
    { id: "full", labelKey: "set.full", basePrice: 1990 },
    { id: "fullTrunk", labelKey: "set.fullTrunk", basePrice: 2590 },
  ],
  logos: [
    { id: "none", labelKey: "logo.none", addon: 0 },
    { id: "brand", labelKey: "logo.brand", addon: 150 },
    { id: "custom", labelKey: "logo.custom", addon: 250 },
  ],
  accessories: [
    { id: "heelPad", label: "Topuk desteği" },
    { id: "logo", label: "Shildik/logo" },
  ],
} as const;

export function findProductOption(
  group: keyof typeof PRODUCT_OPTIONS,
  id: string
) {
  return PRODUCT_OPTIONS[group].find((item) => item.id === id);
}

