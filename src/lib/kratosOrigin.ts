/**
 * kratosOrigin — canonical base URL for KRATOS Mission Control (:5174).
 *
 * Single source of truth — import from here instead of
 * hard-coding protocol+hostname in components.
 */
export const KRATOS_ORIGIN =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5174`
    : "http://localhost:5174";
