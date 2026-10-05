import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SonoBuddy AI",
    short_name: "SonoBuddy AI",
    description: "AI-Guided Ultrasound Study Companion",
    start_url: "/",
    display: "standalone",
    background_color: "#eef3f8",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/sonobuddy-favicon.png",
        sizes: "236x236",
        type: "image/png",
      },
      {
        src: "/sonobuddy-favicon.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
