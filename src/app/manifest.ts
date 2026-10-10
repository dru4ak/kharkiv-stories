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
    ],
  };
}
