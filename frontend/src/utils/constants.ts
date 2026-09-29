import type { Symptom } from '../types/symptom.types';

export const SYMPTOMS: Symptom[] = [
  { id: 'fever',        name: 'Fever',        nameNy: 'Kutentha kwa thupi', category: 'general' },
  { id: 'headache',     name: 'Headache',     nameNy: 'Mutu',                category: 'neurological' },
  { id: 'vomiting',     name: 'Vomiting',     nameNy: 'Kusanza',             category: 'gastrointestinal' },
  { id: 'diarrhoea',    name: 'Diarrhoea',    nameNy: 'Kutsegula m\'mimba',  category: 'gastrointestinal' },
  { id: 'cough',        name: 'Cough',        nameNy: 'Chifuwa',             category: 'respiratory' },
  { id: 'runny_nose',   name: 'Runny Nose',   nameNy: 'Chimfine',            category: 'respiratory' },
  { id: 'body_pains',   name: 'Body Pains',   nameNy: 'Kupweteka kwa thupi', category: 'general' },
  { id: 'chills',       name: 'Chills',       nameNy: 'Kuzizira',            category: 'general' },
  { id: 'fatigue',      name: 'Fatigue',      nameNy: 'Kutopa',              category: 'general' },
  { id: 'joint_pains',  name: 'Joint Pains',  nameNy: 'Kupweteka kwa mafupa', category: 'general' },
];

export const SYMPTOM_CATEGORIES = {
  general:         'General',
  gastrointestinal:'Gastrointestinal',
  respiratory:     'Respiratory',
  neurological:    'Neurological',
  skin:            'Skin',
} as const;