export interface LandingCta {
  label: string;
  href: string;
}

export interface LandingHeroCopy {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: LandingCta;
  secondaryCta: LandingCta;
}

export interface LandingFeatureCopy {
  title: string;
  description: string;
}

export interface LandingStatCopy {
  label: string;
  value: string;
}

export interface LandingPageCopy {
  hero: LandingHeroCopy;
  features: LandingFeatureCopy[];
  stats: LandingStatCopy[];
}

