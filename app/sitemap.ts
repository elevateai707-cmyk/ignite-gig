import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ignite-gig.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/income", priority: 0.8, changeFrequency: "monthly" },
    { path: "/expenses", priority: 0.8, changeFrequency: "monthly" },
    { path: "/mileage", priority: 0.8, changeFrequency: "monthly" },
    { path: "/settings", priority: 0.5, changeFrequency: "monthly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${APP_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
