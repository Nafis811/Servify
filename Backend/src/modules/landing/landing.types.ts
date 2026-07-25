export interface NavItem {
  label: string;
  href: string;
}

export interface LandingFeature {
  title: string;
  description: string;
}

export interface LandingStat {
  label: string;
  value: string;
}

export interface LandingHero {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: NavItem;
  secondaryCta: NavItem;
}

export interface LandingPayload {
  nav: NavItem[];
  hero: LandingHero;
  features: LandingFeature[];
  stats: LandingStat[];
}
