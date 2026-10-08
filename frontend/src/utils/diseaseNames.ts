/**
 * Chichewa translations for the 15 Malawi-priority diseases.
 *
 * Notes:
 * - Malaria, Typhoid, Dengue, Pneumonia, and Cholera are commonly used as-is
 *   in Chichewa, so they are kept in English.
 * - Hepatitis A/B/C/D/E: "Hepatitis" is widely known, so the letter suffix is preserved.
 * - Tuberculosis: known colloquially as "TB" or "chifuwa chachikulu"
 */
export const DISEASE_NAMES: Record<string, { en: string; ny: string }> = {
  malaria: { en: 'Malaria', ny: 'Malungo' },
  typhoid: { en: 'Typhoid', ny: 'Typhoid' },
  tuberculosis: { en: 'Tuberculosis', ny: 'TB (Chifuwa Chachikulu)' },
  dengue: { en: 'Dengue', ny: 'Dengue' },
  'hepatitis a': { en: 'Hepatitis A', ny: 'Hepatitis A' },
  'hepatitis b': { en: 'Hepatitis B', ny: 'Hepatitis B' },
  'hepatitis c': { en: 'Hepatitis C', ny: 'Hepatitis C' },
  'hepatitis d': { en: 'Hepatitis D', ny: 'Hepatitis D' },
  'hepatitis e': { en: 'Hepatitis E', ny: 'Hepatitis E' },
  gastroenteritis: { en: 'Gastroenteritis', ny: 'Kutsegula m’mimba' },
  pneumonia: { en: 'Pneumonia', ny: 'Nimonia' },
  hypothyroidism: { en: 'Hypothyroidism', ny: 'Kuchepa kwa thyroid' },
  diabetes: { en: 'Diabetes', ny: 'Matenda a shuga' },
  hypertension: { en: 'Hypertension', ny: 'Kuthamanga kwa magazi' },
  cholera: { en: 'Cholera', ny: 'Kolera' },
};

/**
 * Return the translated disease name.
 * Falls back to title-cased English if no translation exists.
 */
export function translateDisease(
  name: string,
  lang: string
): string {
  const key = name.toLowerCase().trim();
  const entry = DISEASE_NAMES[key];
  if (!entry) {
    // Fallback: capitalize the original
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return lang === 'ny' ? entry.ny : entry.en;
}