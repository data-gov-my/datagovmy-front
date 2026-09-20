/**
 * Service and station slugs for the explorer's URLs.
 *
 * The old route put raw labels in the path, so a link read
 * `/tebrau/JB%20Sentral/Woodlands%20CIQ` -- unreadable, and unpleasant to paste
 * anywhere. The address bar now carries slugs and the label never appears in a
 * link.
 *
 * Unlike the Rapid explorer, KTMB station labels carry no code prefix ("KL
 * Sentral", not "KJ15: KL Sentral"), so a slug is just the lowercased name.
 * Names are only unique *within* a service -- KL Sentral is an ETS station and
 * a Komuter station and they are different rows -- which is why the service is
 * part of the URL rather than inferred from the pair.
 */

export const ALL_STATIONS_SLUG = "all-stations";

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** "KL Sentral" -> "kl-sentral"; the All Stations aggregate gets a fixed slug. */
export function stationSlug(station: string, allStations: string): string {
  if (station === allStations) return ALL_STATIONS_SLUG;
  return slugify(station);
}

/** Slug -> station label, for reading a URL back. */
export function slugLookup(stations: string[], allStations: string): Map<string, string> {
  const bySlug = new Map<string, string>();
  for (const station of stations) bySlug.set(stationSlug(station, allStations), station);
  return bySlug;
}

/**
 * "komuter_utara" -> "komuter-utara".
 *
 * The service keys are already URL-safe, so this only swaps the underscore for
 * a hyphen to match the rest of the path. `serviceFromSlug` accepts both, which
 * is what keeps the old `/komuter_utara/...` links working.
 */
export const serviceSlug = (service: string) => service.replace(/_/g, "-");

export function serviceFromSlug(slug: string, services: string[]): string | undefined {
  return services.find(s => s === slug || serviceSlug(s) === slug);
}
