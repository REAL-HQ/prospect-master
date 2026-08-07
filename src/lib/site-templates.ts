// Category-aware theming for generated client websites.
// Client-safe: imported by both the dashboard preview and the public /s/$slug page.
import dental from "@/assets/dental-hero.jpg";
import salon from "@/assets/cat-salon.jpg";
import plumbing from "@/assets/cat-plumbing.jpg";
import restaurant from "@/assets/cat-restaurant.jpg";
import gym from "@/assets/cat-gym.jpg";
import auto from "@/assets/cat-auto.jpg";
import law from "@/assets/cat-law.jpg";

export type TemplateId = "modern" | "classic" | "bold";

export type SiteTheme = {
  heroKey: string;
  template: TemplateId;
  palette: { primary: string; bg: string };
};

const HEROES: Record<string, string> = {
  dental,
  salon,
  plumbing,
  restaurant,
  gym,
  auto,
  law,
};

const THEMES: Record<string, SiteTheme> = {
  Dentists: { heroKey: "dental", template: "modern", palette: { primary: "#0E7C6B", bg: "#F2FBF8" } },
  Salons: { heroKey: "salon", template: "modern", palette: { primary: "#B4796A", bg: "#FBF6F3" } },
  Plumbers: { heroKey: "plumbing", template: "bold", palette: { primary: "#1F5FBF", bg: "#F3F7FD" } },
  Restaurants: { heroKey: "restaurant", template: "classic", palette: { primary: "#9C3B1B", bg: "#FCF6EF" } },
  Gyms: { heroKey: "gym", template: "bold", palette: { primary: "#16A34A", bg: "#F2FAF4" } },
  Auto: { heroKey: "auto", template: "bold", palette: { primary: "#B3261E", bg: "#FAF4F3" } },
  Lawyers: { heroKey: "law", template: "classic", palette: { primary: "#1E3A5F", bg: "#F5F7FA" } },
};

const FALLBACK: SiteTheme = {
  heroKey: "restaurant",
  template: "modern",
  palette: { primary: "#CC0000", bg: "#FFF8F8" },
};

export function themeFor(category: string): SiteTheme {
  return THEMES[category] ?? FALLBACK;
}

export function heroImage(heroKey?: string): string {
  return HEROES[heroKey ?? ""] ?? HEROES.restaurant;
}

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  modern: "Modern",
  classic: "Classic",
  bold: "Bold",
};
