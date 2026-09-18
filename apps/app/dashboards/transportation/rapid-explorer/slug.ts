/**
 * Station slugs for the explorer's URLs.
 *
 * Stations are identified in the data by their published label, code and all
 * ("KJ10: KLCC"). That is unambiguous but makes a hostile URL once encoded --
 * `KJ10%3A%20KLCC` -- so the address bar uses a slug instead and the label
 * never appears in a link.
 *
 * The code is kept in the slug rather than dropped: it is what guarantees
 * uniqueness, since station names alone are not (there are two Sentuls). The
 * one exception is the "All Stations" aggregate, whose `A0:` prefix exists only
 * to sort it to the top of a dropdown and would be noise in a URL.
 */

export const ALL_STATIONS_SLUG = "all-stations";

/** "KJ10: KLCC" -> "kj10-klcc" */
export function stationSlug(station: string, allStations: string): string {
  if (station === allStations) return ALL_STATIONS_SLUG;
  return station
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug -> station label, for reading a URL back. */
export function slugLookup(stations: string[], allStations: string): Map<string, string> {
  const bySlug = new Map<string, string>();
  for (const station of stations) bySlug.set(stationSlug(station, allStations), station);
  return bySlug;
}
