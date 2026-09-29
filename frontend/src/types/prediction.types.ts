export interface PredictionRequest {
  symptoms: string[];       // symptom IDs
  age?: number;
  gender?: 'male' | 'female' | 'other';
  durationDays?: number;
  language: 'en' | 'ny';
}

export interface PredictionResult {
  id: string;
  predictedDisease: {
    id: string;
    name: string;
    nameNy: string;
    confidence: number;      // 0-1
    description: string;
    severity: 'low' | 'moderate' | 'high';
  };
  alternativeDiseases: Array<{
    id: string;
    name: string;
    nameNy: string;
    confidence: number;
  }>;
  prevention: PreventionRecommendation[];
  recommendation: string;    // seek care / self-manage
  disclaimer: string;
  createdAt: string;
}

export interface PreventionRecommendation {
  id: string;
  title: string;
  titleNy: string;
  description: string;
  descriptionNy: string;
  category: 'hygiene' | 'diet' | 'environment' | 'medical' | 'lifestyle';
}