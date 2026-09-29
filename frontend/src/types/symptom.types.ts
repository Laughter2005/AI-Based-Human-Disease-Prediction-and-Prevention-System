export interface Symptom {
  id: string;
  name: string;        // English
  nameNy: string;      // Chichewa
  category: SymptomCategory;
  description?: string;
}

export type SymptomCategory =
  | 'general'
  | 'gastrointestinal'
  | 'respiratory'
  | 'neurological'
  | 'skin';