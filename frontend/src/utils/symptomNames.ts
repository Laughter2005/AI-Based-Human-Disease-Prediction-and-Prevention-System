/**
 * Chichewa translations for symptom names.
 * English keys are lowercase with underscores, matching the backend vocabulary.
 */
export const SYMPTOM_NAMES: Record<string, { en: string; ny: string }> = {
  // ---------- General / systemic ----------
  fever: { en: 'Fever', ny: 'Kutentha kwa thupi' },
  mild_fever: { en: 'Mild fever', ny: 'Kutentha pang’ono kwa thupi' },
  high_fever: { en: 'High fever', ny: 'Kutentha kwakukulu kwa thupi' },
  chills: { en: 'Chills', ny: 'Kuzizira' },
  fatigue: { en: 'Fatigue', ny: 'Kutopa' },
  weakness: { en: 'Weakness', ny: 'Kufooka' },
  lethargy: { en: 'Lethargy', ny: 'Kulefuka' },
  malaise: { en: 'Malaise', ny: 'Kusamva bwino' },
  sweating: { en: 'Sweating', ny: 'Kutuluka thukuta' },
  shivering: { en: 'Shivering', ny: 'Kunjenjemera' },
  restlessness: { en: 'Restlessness', ny: 'Kusakhazikika' },
  dehydration: { en: 'Dehydration', ny: 'Kuperewera madzi m’thupi' },
  weight_loss: { en: 'Weight loss', ny: 'Kuonda' },
  weight_gain: { en: 'Weight gain', ny: 'Kunenepa' },
  obesity: { en: 'Obesity', ny: 'Kunenepa kwambiri' },
  cold_hands_and_feets: { en: 'Cold hands and feet', ny: 'Manja ndi mapazi ozizira' },

  // ---------- Neurological ----------
  headache: { en: 'Headache', ny: 'Mutu' },
  dizziness: { en: 'Dizziness', ny: 'Chizungulire' },
  spinning_movements: { en: 'Spinning sensation', ny: 'Kuzungulirazungulira' },
  loss_of_balance: { en: 'Loss of balance', ny: 'Kulephera kukhazikika' },
  unsteadiness: { en: 'Unsteadiness', ny: 'Kusakhazikika' },
  loss_of_smell: { en: 'Loss of smell', ny: 'Kulephera kununkhiza' },
  lack_of_concentration: { en: 'Lack of concentration', ny: 'Kulephera kusamala' },
  altered_sensorium: { en: 'Altered consciousness', ny: 'Kusokonekera maganizo' },
  slurred_speech: { en: 'Slurred speech', ny: 'Kulankhula mokakamiza' },
  coma: { en: 'Coma', ny: 'Kukomoka' },
  stiff_neck: { en: 'Stiff neck', ny: 'Khosi lolimba' },
  weakness_of_one_body_side: { en: 'Weakness on one side', ny: 'Kufooka mbali imodzi' },
  weakness_in_limbs: { en: 'Weakness in limbs', ny: 'Kufooka miyendo ndi manja' },
  muscle_weakness: { en: 'Muscle weakness', ny: 'Kufooka kwa minofu' },
  muscle_wasting: { en: 'Muscle wasting', ny: 'Kuonda kwa minofu' },
  muscle_pain: { en: 'Muscle pain', ny: 'Kupweteka kwa minofu' },
  movement_stiffness: { en: 'Movement stiffness', ny: 'Kulimba kwa thupi' },

  // ---------- Eyes ----------
  yellowing_of_eyes: { en: 'Yellowing of eyes', ny: 'Maso achikasu' },
  redness_of_eyes: { en: 'Redness of eyes', ny: 'Maso ofiira' },
  blurred_and_distorted_vision: { en: 'Blurred vision', ny: 'Kusaona bwino' },
  visual_disturbances: { en: 'Visual disturbances', ny: 'Kusokonekera kwa kusaona' },
  pain_behind_the_eyes: { en: 'Pain behind the eyes', ny: 'Kupweteka kumbuyo kwa maso' },
  sunken_eyes: { en: 'Sunken eyes', ny: 'Maso obira' },
  puffy_face_and_eyes: { en: 'Puffy face and eyes', ny: 'Nkhope ndi maso otupa' },
  watering_from_eyes: { en: 'Watery eyes', ny: 'Maso otulutsa madzi' },

  // ---------- Respiratory ----------
  cough: { en: 'Cough', ny: 'Chifuwa' },
  breathlessness: { en: 'Shortness of breath', ny: 'Kulephera kupuma' },
  chest_pain: { en: 'Chest pain', ny: 'Kupweteka pachifuwa' },
  phlegm: { en: 'Phlegm', ny: 'Makhalidwe' },
  mucoid_sputum: { en: 'Mucoid sputum', ny: 'Malovu am’kamwa' },
  rusty_sputum: { en: 'Rusty sputum', ny: 'Malovu ofiira' },
  blood_in_sputum: { en: 'Blood in sputum', ny: 'Magazi m’malovu' },
  runny_nose: { en: 'Runny nose', ny: 'Chimfine' },
  congestion: { en: 'Nasal congestion', ny: 'Mphuno yotsekeka' },
  continuous_sneezing: { en: 'Continuous sneezing', ny: 'Kuyetsemula kosalekeza' },
  throat_irritation: { en: 'Throat irritation', ny: 'Kusokonezeka m’khosi' },
  patches_in_throat: { en: 'Patches in throat', ny: 'Zizindikiro m’khosi' },
  sinus_pressure: { en: 'Sinus pressure', ny: 'Kupanikizika kwa mphuno' },

  // ---------- Digestive ----------
  vomiting: { en: 'Vomiting', ny: 'Kusanza' },
  nausea: { en: 'Nausea', ny: "M'selu" },
  diarrhoea: { en: 'Diarrhoea', ny: 'Kutsegula m’mimba' },
  constipation: { en: 'Constipation', ny: 'Kutsekeka m’mimba' },
  abdominal_pain: { en: 'Abdominal pain', ny: 'Kupweteka m’mimba' },
  stomach_pain: { en: 'Stomach pain', ny: 'Kupweteka m’mimba' },
  belly_pain: { en: 'Belly pain', ny: 'Kupweteka m’mimba' },
  distention_of_abdomen: { en: 'Distended abdomen', ny: 'Mimba yotupa' },
  swelling_of_stomach: { en: 'Swollen stomach', ny: 'Mimba yotupa' },
  indigestion: { en: 'Indigestion', ny: 'Kusagaya chakudya' },
  acidity: { en: 'Acidity', ny: 'Kutentha m’mimba' },
  loss_of_appetite: { en: 'Loss of appetite', ny: 'Kusafuna chakudya' },
  increased_appetite: { en: 'Increased appetite', ny: 'Kufuna chakudya kwambiri' },
  excessive_hunger: { en: 'Excessive hunger', ny: 'Njara yambiri' },
  passage_of_gases: { en: 'Passing gas', ny: 'Kutulutsa mpweya' },
  stomach_bleeding: { en: 'Stomach bleeding', ny: 'Magazi m’mimba' },
  bloody_stool: { en: 'Bloody stool', ny: 'Chimbudzi chamagazi' },
  pain_during_bowel_movements: { en: 'Pain during bowel movements', ny: 'Kupweteka pochimbudzi' },
  pain_in_anal_region: { en: 'Pain in anal region', ny: 'Kupweteka kumbuyo' },
  irritation_in_anus: { en: 'Irritation in anus', ny: 'Kuyabwa kumbuyo' },
  internal_itching: { en: 'Internal itching', ny: 'Kuyabwa mkati' },

  // ---------- Urinary ----------
  burning_micturition: { en: 'Burning when urinating', ny: 'Kuwawa pokodza' },
  bladder_discomfort: { en: 'Bladder discomfort', ny: 'Kusamva bwino m’chikhodzodzo' },
  continuous_feel_of_urine: { en: 'Constant urge to urinate', ny: 'Kufuna kukodza nthawi zonse' },
  dark_urine: { en: 'Dark urine', ny: 'Mkodzo wakuda' },
  yellow_urine: { en: 'Yellow urine', ny: 'Mkodzo wachikasu' },
  polyuria: { en: 'Frequent urination', ny: 'Kukodza pafupipafupi' },

  // ---------- Skin ----------
  skin_rash: { en: 'Skin rash', ny: 'Zidzolo pakhungu' },
  nodal_skin_eruptions: { en: 'Nodal skin eruptions', ny: 'Zotupa pakhungu' },
  itching: { en: 'Itching', ny: 'Kuyabwa' },
  skin_peeling: { en: 'Skin peeling', ny: 'Kusenda kwa khungu' },
  yellowish_skin: { en: 'Yellowish skin', ny: 'Khungu lachikasu' },
  bruising: { en: 'Bruising', ny: 'Mabala obiriwira' },
  red_spots_over_body: { en: 'Red spots over body', ny: 'Madontho ofiira m’thupi' },
  red_sore_around_nose: { en: 'Red sore around nose', ny: 'Chilonda chofiira pamphuno' },
  pus_filled_pimples: { en: 'Pus-filled pimples', ny: 'Zidzolo zamadzi' },
  blackheads: { en: 'Blackheads', ny: 'Zidzolo zakuda' },
  scurring: { en: 'Scaly skin', ny: 'Khungu louma' },
  silver_like_dusting: { en: 'Silver-like scaling', ny: 'Khungu loyera ngati siliva' },
  blister: { en: 'Blister', ny: 'Chithuza' },
  'dischromic _patches': { en: 'Discoloured patches', ny: 'Madontho osiyana mtundu' },
  yellow_crust_ooze: { en: 'Yellow crust or ooze', ny: 'Zonyowa zachikasu' },

  // ---------- Nails ----------
  brittle_nails: { en: 'Brittle nails', ny: 'Zikhadabo zosweka' },
  small_dents_in_nails: { en: 'Small dents in nails', ny: 'Mabowo ang’ono m’zikhadabo' },
  inflammatory_nails: { en: 'Inflamed nails', ny: 'Zikhadabo zotupa' },

  // ---------- Muscular / joint ----------
  joint_pain: { en: 'Joint pain', ny: 'Kupweteka kwa mafupa' },
  swelling_joints: { en: 'Swollen joints', ny: 'Mafupa otupa' },
  hip_joint_pain: { en: 'Hip joint pain', ny: 'Kupweteka m’chiuno' },
  knee_pain: { en: 'Knee pain', ny: 'Kupweteka bondo' },
  back_pain: { en: 'Back pain', ny: 'Kupweteka msana' },
  neck_pain: { en: 'Neck pain', ny: 'Kupweteka khosi' },
  painful_walking: { en: 'Painful walking', ny: 'Kuyenda kowawa' },
  cramps: { en: 'Cramps', ny: 'Kukhwinyata' },
  swollen_legs: { en: 'Swollen legs', ny: 'Miyendo yotupa' },
  swollen_extremeties: { en: 'Swollen extremities', ny: 'Miyendo ndi manja otupa' },
  swollen_blood_vessels: { en: 'Swollen blood vessels', ny: 'Mitsempha yotupa' },
  prominent_veins_on_calf: { en: 'Prominent veins on calf', ny: 'Mitsempha yooneka m’ng’ombe' },
  swelling_lymph_nodes: { en: 'Swollen lymph nodes', ny: 'Mafupa otupa' },

  // ---------- Cardiovascular / heart ----------
  fast_heart_rate: { en: 'Fast heart rate', ny: 'Kugunda kwamtima mwachangu' },
  palpitations: { en: 'Palpitations', ny: 'Kugunda kwamtima mwamphamvu' },
  fluid_overload: { en: 'Fluid retention', ny: 'Kusunga madzi m’thupi' },

  // ---------- Endocrine / metabolic ----------
  irregular_sugar_level: { en: 'Irregular blood sugar', ny: 'Shuga wosasinthasintha' },
  enlarged_thyroid: { en: 'Enlarged thyroid', ny: 'Thyroid yotupa' },
  drying_and_tingling_lips: { en: 'Drying and tingling lips', ny: 'Milomo youma ndi kugwedezeka' },

  // ---------- Reproductive / other ----------
  abnormal_menstruation: { en: 'Abnormal menstruation', ny: 'Kusamba kosasinthasintha' },
  spotting_urination: { en: 'Spotting during urination', ny: 'Madontho pokodza' },

  // ---------- History / exposure ----------
  family_history: { en: 'Family history', ny: 'Mbiri ya banja' },
  history_of_alcohol_consumption: { en: 'Alcohol consumption history', ny: 'Mbiri ya kumwa mowa' },
  extra_marital_contacts: { en: 'Extra-marital contacts', ny: 'Kugonana kunja kwa ukwati' },
  receiving_blood_transfusion: { en: 'Recent blood transfusion', ny: 'Kuthansfusiwa magazi posachedwa' },
  receiving_unsterile_injections: { en: 'Recent unsterile injections', ny: 'Jekeseni wosayeretsedwa' },

  // ---------- Other ----------
  anxiety: { en: 'Anxiety', ny: 'Nkhawa' },
  depression: { en: 'Depression', ny: 'Kukhumudwa' },
  irritability: { en: 'Irritability', ny: 'Kukwiya mwachangu' },
  mood_swings: { en: 'Mood swings', ny: 'Kusinthasintha maganizo' },
  acute_liver_failure: { en: 'Acute liver failure', ny: 'Kulephera kwa chiwindi' },
  'toxic_look_(typhos)': { en: 'Toxic appearance', ny: 'Maonekedwe ofooka' },
  'foul_smell_of urine': { en: 'Foul smell of urine', ny: 'Mkodzo wonunkha' },
  'spotting_ urination': { en: 'Spotting during urination', ny: 'Madontho pokodza' },
  ulcers_on_tongue: { en: 'Ulcers on tongue', ny: 'Zilonda palilime' },
};

/**
 * Return the translated symptom name.
 * Falls back to title-cased English (with underscores replaced) if no translation exists.
 */
export function translateSymptom(
  id: string,
  lang: string
): string {
  const key = id.toLowerCase().trim();
  const entry = SYMPTOM_NAMES[key];
  if (!entry) {
    return id.replace(/_/g, ' ').trim();
  }
  return lang === 'ny' ? entry.ny : entry.en;
}