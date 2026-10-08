export interface PredictionRequest {
  symptoms: string[];
  top_k?: number;
  language?: 'en' | 'ny';
}

export interface DiseasePrediction {
  disease: string;
  confidence: number;
}

// Raw shape returned by FastAPI today
export interface PredictionResponseRaw {
  model: string;
  input_symptoms: string[];
  unknown_symptoms: string[];
  top_predictions: DiseasePrediction[];
  language: string;
}

// Normalized shape used by the frontend (Option B)
export interface PredictionResult {
  model: string;
  inputSymptoms: string[];
  unknownSymptoms: string[];
  language: string;

  // Derived from top_predictions
  predictedDisease: {
    name: string;
    confidence: number;
    severity: 'low' | 'moderate' | 'high';
  };
  alternativeDiseases: DiseasePrediction[];

  // Placeholder until backend sends real prevention data
  prevention: PreventionItem[];
}

export interface PreventionItem {
  id: string;
  title: { en: string; ny: string };
  description: { en: string; ny: string };
  category: 'hygiene' | 'diet' | 'environment' | 'medical' | 'lifestyle';
}