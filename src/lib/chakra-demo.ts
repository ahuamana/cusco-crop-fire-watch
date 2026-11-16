// Demo-only values. Replace with sourced, timestamped observations from a verified
// SENAMHI feed before showing live weather or deriving real fire risk.
export const demoRisk = { level: 3, maximum: 4, updated: "15 nov 2026 · 08:00", temperature: 26, humidity: 28, wind: 18 };
export const emergencyNumbers = { civilDefense: "115", firefighters: "116" };

export function normalizePeruMobile(value: string): string | null {
  const cleaned = value.replace(/[\s()-]/g, "");
  const local = cleaned.startsWith("+51") ? cleaned.slice(3) : cleaned;
  return /^9\d{8}$/.test(local) ? `+51${local}` : null;
}