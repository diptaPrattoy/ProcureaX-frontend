import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return ["", "/about", "/platform", "/suppliers", "/contact", "/faq"].map((path) => ({ url: `${base}${path || "/"}`, lastModified: new Date(), changeFrequency: path === "/suppliers" ? "daily" : "monthly", priority: path === "" ? 1 : 0.7 }));
}
