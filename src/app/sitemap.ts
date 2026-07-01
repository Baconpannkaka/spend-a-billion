import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticRoutes = ["", "/shop", "/varukorg", "/kassa", "/resultat", "/sa-fungerar-det", "/om", "/bildkallor", "/juridiskt"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.7 })),
    ...products.map((product) => ({ url: `${base}/produkt/${product.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
