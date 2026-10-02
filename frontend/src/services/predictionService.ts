import api from './api';
import type {
  PredictionRequest,
  PredictionResponseRaw,
  PredictionResult,
  PreventionItem,
  DiseasePrediction,
} from '../types/prediction.types';

// ---------- Fallback prevention rules ----------
const FALLBACK_PREVENTION: Record<string, PreventionItem[]> = {
  malaria: [
    { id: 'm1', title: 'Sleep under a mosquito net', description: 'Use an insecticide-treated net every night, especially during rainy season.', category: 'environment' },
    { id: 'm2', title: 'Remove standing water', description: 'Empty containers, tyres, and puddles around your home to stop mosquito breeding.', category: 'environment' },
    { id: 'm3', title: 'Seek testing early', description: 'If fever persists more than 24 hours, get a rapid malaria test at the nearest clinic.', category: 'medical' },
  ],
  typhoid: [
    { id: 't1', title: 'Drink safe water', description: 'Boil, filter, or treat water with chlorine before drinking.', category: 'hygiene' },
    { id: 't2', title: 'Wash hands with soap', description: 'Always wash hands after using the toilet and before eating.', category: 'hygiene' },
    { id: 't3', title: 'Avoid raw street food', description: 'Eat freshly cooked, hot food and peel your own fruit.', category: 'diet' },
  ],
  tuberculosis: [
    { id: 'tb1', title: 'Cover your mouth when coughing', description: 'Use a tissue or your elbow to prevent spreading infection.', category: 'hygiene' },
    { id: 'tb2', title: 'Get a sputum test', description: 'Visit a clinic for a free TB test if you have coughed for more than 2 weeks.', category: 'medical' },
    { id: 'tb3', title: 'Eat nutritious food', description: 'Good nutrition supports recovery. Eat fruits, vegetables, and proteins.', category: 'diet' },
  ],
  dengue: [
    { id: 'd1', title: 'Avoid mosquito bites', description: 'Use repellent and wear long sleeves, especially at dawn and dusk.', category: 'environment' },
    { id: 'd2', title: 'Eliminate breeding sites', description: 'Cover water containers and clear standing water weekly.', category: 'environment' },
    { id: 'd3', title: 'Rest and hydrate', description: 'Drink plenty of fluids and rest. Avoid aspirin.', category: 'medical' },
  ],
  pneumonia: [
    { id: 'p1', title: 'Seek medical care', description: 'Pneumonia can be serious. Visit a clinic if breathing is difficult.', category: 'medical' },
    { id: 'p2', title: 'Rest and hydrate', description: 'Drink warm fluids and rest to help your body recover.', category: 'lifestyle' },
    { id: 'p3', title: 'Avoid smoke', description: 'Stay away from smoke, dust, and other lung irritants.', category: 'environment' },
  ],
  gastroenteritis: [
    { id: 'g1', title: 'Rehydrate with ORS', description: 'Use oral rehydration salts to replace lost fluids and electrolytes.', category: 'medical' },
    { id: 'g2', title: 'Wash hands thoroughly', description: 'Prevent spread by washing hands with soap after toilet use.', category: 'hygiene' },
    { id: 'g3', title: 'Eat bland foods', description: 'Rice, bananas, and toast are easy on the stomach during recovery.', category: 'diet' },
  ],
  'hepatitis a': [
    { id: 'ha1', title: 'Rest and hydrate', description: 'Your liver needs rest. Avoid alcohol completely.', category: 'lifestyle' },
    { id: 'ha2', title: 'Wash hands with soap', description: 'Hepatitis A spreads through contaminated food and water.', category: 'hygiene' },
    { id: 'ha3', title: 'Get vaccinated', description: 'Ask your clinic about the hepatitis A vaccine for household members.', category: 'medical' },
  ],
  'hepatitis b': [
    { id: 'hb1', title: 'Get tested and monitored', description: 'Regular liver checkups are essential.', category: 'medical' },
    { id: 'hb2', title: 'Avoid alcohol', description: 'Alcohol damages the liver further.', category: 'lifestyle' },
    { id: 'hb3', title: 'Vaccinate household members', description: 'Hepatitis B vaccine protects close contacts.', category: 'medical' },
  ],
  'hepatitis c': [
    { id: 'hc1', title: 'Seek treatment', description: 'Modern hepatitis C treatments can cure the infection. Ask your clinic.', category: 'medical' },
    { id: 'hc2', title: 'Avoid alcohol', description: 'Protect your liver while being treated.', category: 'lifestyle' },
    { id: 'hc3', title: 'Do not share razors', description: 'Prevent transmission to others.', category: 'hygiene' },
  ],
  'hepatitis d': [
    { id: 'hd1', title: 'Consult a specialist', description: 'Hepatitis D only occurs with hepatitis B. Specialist care is essential.', category: 'medical' },
    { id: 'hd2', title: 'Rest your liver', description: 'Avoid alcohol, fatty foods, and unnecessary medications.', category: 'lifestyle' },
    { id: 'hd3', title: 'Vaccinate against Hepatitis B', description: 'Preventing hepatitis B prevents hepatitis D.', category: 'medical' },
  ],
  'hepatitis e': [
    { id: 'he1', title: 'Drink safe water', description: 'Hepatitis E spreads mainly through contaminated water.', category: 'hygiene' },
    { id: 'he2', title: 'Rest and hydrate', description: 'Most cases resolve on their own with supportive care.', category: 'lifestyle' },
    { id: 'he3', title: 'See a doctor if pregnant', description: 'Hepatitis E can be serious during pregnancy. Seek care early.', category: 'medical' },
  ],
};

const GENERIC_PREVENTION: PreventionItem[] = [
  { id: 'gen1', title: 'Consult a health worker', description: 'Visit your nearest clinic for proper diagnosis and treatment.', category: 'medical' },
  { id: 'gen2', title: 'Rest and hydrate', description: 'Drink plenty of safe water and get adequate rest.', category: 'lifestyle' },
  { id: 'gen3', title: 'Monitor your symptoms', description: 'If symptoms worsen, seek care immediately.', category: 'medical' },
];

function deriveSeverity(confidence: number): 'low' | 'moderate' | 'high' {
  if (confidence >= 0.75) return 'high';
  if (confidence >= 0.45) return 'moderate';
  return 'low';
}

function getPrevention(diseaseName: string): PreventionItem[] {
  const key = diseaseName.toLowerCase().trim();
  return FALLBACK_PREVENTION[key] ?? GENERIC_PREVENTION;
}

function normalize(raw: PredictionResponseRaw): PredictionResult {
  const [top, ...rest] = raw.top_predictions;
  const topDisease = top?.disease ?? 'Unknown';
  const topConfidence = top?.confidence ?? 0;

  return {
    model: raw.model,
    inputSymptoms: raw.input_symptoms,
    unknownSymptoms: raw.unknown_symptoms,
    language: raw.language,
    predictedDisease: {
      name: topDisease,
      confidence: topConfidence,
      severity: deriveSeverity(topConfidence),
    },
    alternativeDiseases: rest,
    prevention: getPrevention(topDisease),
  };
}

// ---------- History types ----------
export interface HistoryItem {
  id: number;
  top_disease: string;
  top_confidence: number;
  model_name: string;
  language: string;
  symptoms: string[];
  unknown_symptoms: string[];
  created_at: string;
}

export const predictionService = {
  async predict(payload: PredictionRequest): Promise<PredictionResult> {
    const { data } = await api.post<PredictionResponseRaw>('/predictions', {
      symptoms: payload.symptoms,
      top_k: payload.top_k ?? 5,
      language: payload.language ?? 'en',
    });
    return normalize(data);
  },

  async history(limit = 50): Promise<HistoryItem[]> {
    const { data } = await api.get<HistoryItem[]>('/predictions/history', {
      params: { limit },
    });
    return data;
  },
};