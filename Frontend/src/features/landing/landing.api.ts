import { apiFetch } from "../../services/api";
import type { LandingPageCopy } from "./landing.types";

export const getLandingHome = () => apiFetch<LandingPageCopy>("/landing/home");

export const getLandingNavbar = () =>
  apiFetch<Array<{ label: string; href: string }>>("/landing/navbar");

