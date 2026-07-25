import type { LandingPayload, NavItem } from "./landing.types";

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Find Us", href: "/findus" },
  { label: "Chatbot", href: "/chatbot" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

const landingPayload: LandingPayload = {
  nav: navItems,
  hero: {
    eyebrow: "Servify for laptop service",
    title: "Book repairs, browse spare parts, and keep the service flow in one place.",
    description:
      "This landing layer carries the current CI home page intent into a modern Node.js + TypeScript frontend and API split.",
    primaryCta: { label: "Explore Marketplace", href: "/marketplace" },
    secondaryCta: { label: "Create Account", href: "/register" },
  },
  features: [
    {
      title: "Fast intake",
      description: "Users can register and start a service session without leaving the landing flow.",
    },
    {
      title: "Transparent catalog",
      description: "Marketplace cards can be surfaced directly inside landing highlights and promos.",
    },
    {
      title: "Ready for growth",
      description: "Admin, merchant, and reservation flows stay deferred without blocking this first migration step.",
    },
  ],
  stats: [
    { label: "Tracked modules", value: "3" },
    { label: "Deferred modules", value: "5+" },
    { label: "UI split", value: "Frontend + API" },
  ],
};

export class LandingService {
  getHomePage(): LandingPayload {
    return landingPayload;
  }

  getNavbar(): NavItem[] {
    return navItems;
  }
}

export const landingService = new LandingService();
