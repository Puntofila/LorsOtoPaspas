import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LORS OTO PASPAS",
    short_name: "LORS OTO PASPAS",
    description: "Model-specific premium car mats. Custom colors, logos, fast production.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090a",
    theme_color: "#A87C26",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
