import type { LandingPageCopy } from "./landing.types";

export const landingCopy: LandingPageCopy = {
  hero: {
    eyebrow: "Laptop service, simplified",
    title: "Book repair, browse spare parts, and keep service progress visible from one place.",
    description:
      "This landing page keeps the Home and Navbar experience from the CI4 project while moving the surface into a modern React + TypeScript structure.",
    primaryCta: {
      label: "Explore Marketplace",
      href: "/marketplace",
    },
    secondaryCta: {
      label: "Create account",
      href: "/register",
    },
  },
  features: [
    {
      title: "Fast registration",
      description: "The new auth flow is prepared for login, register, and session handling.",
    },
    {
      title: "Marketplace ready",
      description: "Products, categories, and detail views are separated for later API wiring.",
    },
    {
      title: "Landing first",
      description: "Home content and navbar are now ownable UI pieces instead of legacy view files.",
    },
  ],
  stats: [
    { label: "Tracked modules", value: "3" },
    { label: "Deferred modules", value: "5+" },
    { label: "UI split", value: "Frontend + API" },
  ],
};

