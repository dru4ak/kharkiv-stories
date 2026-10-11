import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Легенды Харькова",
    short_name: "Легенды Харькова",
    description:
      "Городские байки, слухи и предания о Харькове. Памяти Савелия Цыпина.",
    start_url: "/kh",
    display: "standalone",
    background_color: "#f3ebe0",
    theme_color: "#8b3a2a",
    lang: "ru",
    categories: ["books", "education", "entertainment"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
