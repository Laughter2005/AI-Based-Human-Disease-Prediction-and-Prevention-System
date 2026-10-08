import api from './api';
import type {
  PredictionRequest,
  PredictionResponseRaw,
  PredictionResult,
  PreventionItem,
  DiseasePrediction,
} from '../types/prediction.types';

// ---------- Fallback prevention rules ----------
// ---------- Fallback prevention rules (bilingual) ----------
const FALLBACK_PREVENTION: Record<string, PreventionItem[]> = {
  malaria: [
    {
      id: 'm1',
      title: { en: 'Sleep under a mosquito net', ny: 'Gonani pansi pa neti ya udzudzu' },
      description: {
        en: 'Use an insecticide-treated net every night, especially during rainy season.',
        ny: 'Gwiritsani ntchito neti yothiridwa mankhwala usiku uliwonse, makamaka nyengo ya mvula.',
      },
      category: 'environment',
    },
    {
      id: 'm2',
      title: { en: 'Remove standing water', ny: 'Chotsani madzi oimilira' },
      description: {
        en: 'Empty containers, tyres, and puddles around your home to stop mosquito breeding.',
        ny: 'Chotsani madzi m’matanki, matayala, ndi m’maenje ozungulira nyumba yanu kuti udzudzu usaberekere.',
      },
      category: 'environment',
    },
    {
      id: 'm3',
      title: { en: 'Seek testing early', ny: 'Yesetsani kuyezedwa msanga' },
      description: {
        en: 'If fever persists more than 24 hours, get a rapid malaria test at the nearest clinic.',
        ny: 'Ngati kutentha kwa thupi kukupitirira kuposa maola 24, yesetsani kuyezedwa malungo ku chipatala chapafupi.',
      },
      category: 'medical',
    },
  ],
  typhoid: [
    {
      id: 't1',
      title: { en: 'Drink safe water', ny: 'Imwani madzi abwino' },
      description: {
        en: 'Boil, filter, or treat water with chlorine before drinking.',
        ny: 'Wiritsani, seferani, kapena thirani mankhwala a chlorine m’madzi asanaimwe.',
      },
      category: 'hygiene',
    },
    {
      id: 't2',
      title: { en: 'Wash hands with soap', ny: 'Sambani manja ndi sopo' },
      description: {
        en: 'Always wash hands after using the toilet and before eating.',
        ny: 'Nthawi zonse sambani manja pambuyo pa kugwiritsa ntchito chimbudzi komanso musanadye.',
      },
      category: 'hygiene',
    },
    {
      id: 't3',
      title: { en: 'Avoid raw street food', ny: 'Pewani zakudya zam’misewu zosaphika' },
      description: {
        en: 'Eat freshly cooked, hot food and peel your own fruit.',
        ny: 'Idyani zakudya zophikidwa kumene, zotentha, ndipo zizichotsa khungu la zipatso nokha.',
      },
      category: 'diet',
    },
  ],
  tuberculosis: [
    {
      id: 'tb1',
      title: { en: 'Cover your mouth when coughing', ny: 'Phimbani pakamwa mukutsokomola' },
      description: {
        en: 'Use a tissue or your elbow to prevent spreading infection.',
        ny: 'Gwiritsani ntchito pepala kapena chigongono kuti musafalitse matenda.',
      },
      category: 'hygiene',
    },
    {
      id: 'tb2',
      title: { en: 'Get a sputum test', ny: 'Yesetsani kuyeza malovu' },
      description: {
        en: 'Visit a clinic for a free TB test if you have coughed for more than 2 weeks.',
        ny: 'Pitani ku chipatala kukayezedwa TB kwaulere ngati mwakhala mukutsokomola kupitirira masabata awiri.',
      },
      category: 'medical',
    },
    {
      id: 'tb3',
      title: { en: 'Eat nutritious food', ny: 'Idyani zakudya zopatsa thanzi' },
      description: {
        en: 'Good nutrition supports recovery. Eat fruits, vegetables, and proteins.',
        ny: 'Zakudya zabwino zimathandiza kuchira. Idyani zipatso, masamba, ndi zakudya za protein.',
      },
      category: 'diet',
    },
  ],
  dengue: [
    {
      id: 'd1',
      title: { en: 'Avoid mosquito bites', ny: 'Pewani kulumidwa ndi udzudzu' },
      description: {
        en: 'Use repellent and wear long sleeves, especially at dawn and dusk.',
        ny: 'Gwiritsani mankhwala owopseza udzudzu ndi kuvala zovala zazitali, makamaka m’bandakucha ndi madzulo.',
      },
      category: 'environment',
    },
    {
      id: 'd2',
      title: { en: 'Eliminate breeding sites', ny: 'Chotsani malo oberekera udzudzu' },
      description: {
        en: 'Cover water containers and clear standing water weekly.',
        ny: 'Phimbani zotengera madzi ndi kuchotsa madzi oimilira mlungu uliwonse.',
      },
      category: 'environment',
    },
    {
      id: 'd3',
      title: { en: 'Rest and hydrate', ny: 'Pumulani ndi kumwa madzi' },
      description: {
        en: 'Drink plenty of fluids and rest. Avoid aspirin.',
        ny: 'Mwangwanthawi zonse. Pewani mankhwala a aspirin.',
      },
      category: 'medical',
    },
  ],
  pneumonia: [
    {
      id: 'p1',
      title: { en: 'Seek medical care', ny: 'Funsani chithandizo cha dokotala' },
      description: {
        en: 'Pneumonia can be serious. Visit a clinic if breathing is difficult.',
        ny: 'Nimonia ikhoza kukhala yoopsa. Pitani ku chipatala ngati mukuvutika kupuma.',
      },
      category: 'medical',
    },
    {
      id: 'p2',
      title: { en: 'Rest and hydrate', ny: 'Pumulani ndi kumwa madzi' },
      description: {
        en: 'Drink warm fluids and rest to help your body recover.',
        ny: 'Mwangwanthawi zonse. Pumulani kuti thupi lanu lichire.',
      },
      category: 'lifestyle',
    },
    {
      id: 'p3',
      title: { en: 'Avoid smoke', ny: 'Pewani utsi' },
      description: {
        en: 'Stay away from smoke, dust, and other lung irritants.',
        ny: 'Khalani kutali ndi utsi, fumbi, ndi zina zomwe zimasokoneza mapapo.',
      },
      category: 'environment',
    },
  ],
  gastroenteritis: [
    {
      id: 'g1',
      title: { en: 'Rehydrate with ORS', ny: 'Mwangwa madzi a ORS' },
      description: {
        en: 'Use oral rehydration salts to replace lost fluids and electrolytes.',
        ny: 'Gwiritsani ntchito ORS kuti mubweze madzi ndi mchere womwe watayika.',
      },
      category: 'medical',
    },
    {
      id: 'g2',
      title: { en: 'Wash hands thoroughly', ny: 'Sambani manja bwino' },
      description: {
        en: 'Prevent spread by washing hands with soap after toilet use.',
        ny: 'Pewani kufalitsa matenda mwa kusamba manja ndi sopo pambuyo pa chimbudzi.',
      },
      category: 'hygiene',
    },
    {
      id: 'g3',
      title: { en: 'Eat bland foods', ny: 'Idyani zakudya zosavuta' },
      description: {
        en: 'Rice, bananas, and toast are easy on the stomach during recovery.',
        ny: 'Mpunga, nthochi, ndi buledi ndi zakudya zosavuta m’mimba nthawi yochira.',
      },
      category: 'diet',
    },
  ],
  'hepatitis a': [
    {
      id: 'ha1',
      title: { en: 'Rest and hydrate', ny: 'Pumulani ndi kumwa madzi' },
      description: {
        en: 'Your liver needs rest. Avoid alcohol completely.',
        ny: 'Chiwindi chanu chikufuna kupuma. Pewani mowa kotheratu.',
      },
      category: 'lifestyle',
    },
    {
      id: 'ha2',
      title: { en: 'Wash hands with soap', ny: 'Sambani manja ndi sopo' },
      description: {
        en: 'Hepatitis A spreads through contaminated food and water.',
        ny: 'Hepatitis A imafalikira kudzera m’zakudya ndi madzi oipitsidwa.',
      },
      category: 'hygiene',
    },
    {
      id: 'ha3',
      title: { en: 'Get vaccinated', ny: 'Landirani katemera' },
      description: {
        en: 'Ask your clinic about the hepatitis A vaccine for household members.',
        ny: 'Funsani ku chipatala za katemera wa hepatitis A kwa anthu a m’nyumba mwanu.',
      },
      category: 'medical',
    },
  ],
  'hepatitis b': [
    {
      id: 'hb1',
      title: { en: 'Get tested and monitored', ny: 'Yesetsani kuyezedwa ndi kuyang’aniridwa' },
      description: {
        en: 'Regular liver checkups are essential.',
        ny: 'Kuyezedwa kwa chiwindi pafupipafupi ndi kofunika.',
      },
      category: 'medical',
    },
    {
      id: 'hb2',
      title: { en: 'Avoid alcohol', ny: 'Pewani mowa' },
      description: {
        en: 'Alcohol damages the liver further.',
        ny: 'Mowa umawononga chiwindi kwambiri.',
      },
      category: 'lifestyle',
    },
    {
      id: 'hb3',
      title: { en: 'Vaccinate household members', ny: 'Tembererani anthu a m’nyumba' },
      description: {
        en: 'Hepatitis B vaccine protects close contacts.',
        ny: 'Katemera wa hepatitis B amateteza anthu omwe ali pafupi nanu.',
      },
      category: 'medical',
    },
  ],
  'hepatitis c': [
    {
      id: 'hc1',
      title: { en: 'Seek treatment', ny: 'Funsani chithandizo' },
      description: {
        en: 'Modern hepatitis C treatments can cure the infection. Ask your clinic.',
        ny: 'Mankhwala amakono a hepatitis C amatha kuchiza. Funsani ku chipatala chanu.',
      },
      category: 'medical',
    },
    {
      id: 'hc2',
      title: { en: 'Avoid alcohol', ny: 'Pewani mowa' },
      description: {
        en: 'Protect your liver while being treated.',
        ny: 'Tetezani chiwindi chanu mukumatengedwa mankhwala.',
      },
      category: 'lifestyle',
    },
    {
      id: 'hc3',
      title: { en: 'Do not share razors', ny: 'Musagawane malezala' },
      description: {
        en: 'Prevent transmission to others.',
        ny: 'Pewani kufalitsa kwa ena.',
      },
      category: 'hygiene',
    },
  ],
  'hepatitis d': [
    {
      id: 'hd1',
      title: { en: 'Consult a specialist', ny: 'Funsani katswiri' },
      description: {
        en: 'Hepatitis D only occurs with hepatitis B. Specialist care is essential.',
        ny: 'Hepatitis D imapezeka kokha ndi hepatitis B. Chithandizo cha katswiri ndi chofunika.',
      },
      category: 'medical',
    },
    {
      id: 'hd2',
      title: { en: 'Rest your liver', ny: 'Pumuzani chiwindi chanu' },
      description: {
        en: 'Avoid alcohol, fatty foods, and unnecessary medications.',
        ny: 'Pewani mowa, zakudya zamafuta, ndi mankhwala osafunikira.',
      },
      category: 'lifestyle',
    },
    {
      id: 'hd3',
      title: { en: 'Vaccinate against hepatitis B', ny: 'Landirani katemera wa hepatitis B' },
      description: {
        en: 'Preventing hepatitis B prevents hepatitis D.',
        ny: 'Kupewa hepatitis B kumateteza hepatitis D.',
      },
      category: 'medical',
    },
  ],
  'hepatitis e': [
    {
      id: 'he1',
      title: { en: 'Drink safe water', ny: 'Imwani madzi abwino' },
      description: {
        en: 'Hepatitis E spreads mainly through contaminated water.',
        ny: 'Hepatitis E imafalikira makamaka kudzera m’madzi oipitsidwa.',
      },
      category: 'hygiene',
    },
    {
      id: 'he2',
      title: { en: 'Rest and hydrate', ny: 'Pumulani ndi kumwa madzi' },
      description: {
        en: 'Most cases resolve on their own with supportive care.',
        ny: 'Matenda ambiri amatha okha ndi chisamaliro chothandizira.',
      },
      category: 'lifestyle',
    },
    {
      id: 'he3',
      title: { en: 'See a doctor if pregnant', ny: 'Onani dokotala ngati muli ndi pakati' },
      description: {
        en: 'Hepatitis E can be serious during pregnancy. Seek care early.',
        ny: 'Hepatitis E ikhoza kukhala yoopsa nthawi ya pakati. Funsani chithandizo msanga.',
      },
      category: 'medical',
    },
  ],
  hypothyroidism: [
    {
      id: 'hy1',
      title: { en: 'Take thyroid medication daily', ny: 'Mangwaninso mankhwala a thyroid tsiku lililonse' },
      description: {
        en: 'If prescribed levothyroxine, take it every morning on an empty stomach as directed by your health worker.',
        ny: 'Ngati mwapatsidwa levothyroxine, imwani m’mawa uliwonse pa m’mimba yopanda kanthu monga momwe wothandizira zaumoyo anakulangizira.',
      },
      category: 'medical',
    },
    {
      id: 'hy2',
      title: { en: 'Get regular thyroid tests', ny: 'Yesetsani kuyezedwa thyroid pafupipafupi' },
      description: {
        en: 'Have your TSH and T4 levels checked periodically to keep the dosage correct.',
        ny: 'Yesetsani kuyezedwa TSH ndi T4 pafupipafupi kuti mlingo ukhale wolondola.',
      },
      category: 'medical',
    },
    {
      id: 'hy3',
      title: { en: 'Eat iodine-rich foods', ny: 'Idyani zakudya zokhala ndi iodine' },
      description: {
        en: 'Include iodised salt, fish, and dairy. Iodine deficiency worsens thyroid problems.',
        ny: 'Onjezani mchere wa iodised, nsomba, ndi mkaka. Kuperewera kwa iodine kumawonjezera mavuto a thyroid.',
      },
      category: 'diet',
    },
    {
      id: 'hy4',
      title: { en: 'Manage fatigue and rest', ny: 'Yang’anirani kutopa ndi kupuma' },
      description: {
        en: 'Get adequate sleep and pace your activities. Fatigue is common with hypothyroidism.',
        ny: 'Gonani mokwanira ndi kuyendetsa ntchito zanu pang’onopang’ono. Kutopa ndi kofala ndi hypothyroidism.',
      },
      category: 'lifestyle',
    },
  ],
  diabetes: [
    {
      id: 'db1',
      title: { en: 'Monitor blood sugar regularly', ny: 'Yang’anirani shuga wa m’magazi pafupipafupi' },
      description: {
        en: 'Check your blood glucose as advised by your health worker. Keep a log of readings.',
        ny: 'Yesani shuga wa m’magazi monga momwe wothandizira zaumoyo anakulangizira. Sungani zolemba za kuyeza.',
      },
      category: 'medical',
    },
    {
      id: 'db2',
      title: { en: 'Reduce sugar and refined carbs', ny: 'Chepetsani shuga ndi chakudya choyenga' },
      description: {
        en: 'Limit sugary drinks, sweets, and white bread. Choose whole grains and vegetables.',
        ny: 'Chepetsani zakumwa za shuga, maswiti, ndi buledi woyera. Sankhani tirigu wathunthu ndi masamba.',
      },
      category: 'diet',
    },
    {
      id: 'db3',
      title: { en: 'Exercise 30 minutes daily', ny: 'Olimpitseni mphindi 30 tsiku lililonse' },
      description: {
        en: 'Walking, gardening, or cycling helps your body use insulin better.',
        ny: 'Kuyenda, kulima, kapena kukwera njinga zimathandiza thupi lanu kugwiritsa ntchito insulin bwino.',
      },
      category: 'lifestyle',
    },
    {
      id: 'db4',
      title: { en: 'Check your feet daily', ny: 'Yang’anirani mapazi anu tsiku lililonse' },
      description: {
        en: 'Diabetes can reduce sensation. Inspect feet for cuts, blisters, or sores.',
        ny: 'Matenda a shuga amatha kuchepetsa kumva. Yang’anirani mapazi ngati ali ndi mabala kapena zotupa.',
      },
      category: 'medical',
    },
    {
      id: 'db5',
      title: { en: 'Take medication as prescribed', ny: 'Imwani mankhwala monga momwe ananenera' },
      description: {
        en: 'Do not skip insulin or tablets, even when you feel well.',
        ny: 'Musasiye insulin kapena mapiritsi, ngakhale mutakhala kuti mukusamva bwino.',
      },
      category: 'medical',
    },
  ],
  hypertension: [
    {
      id: 'hp1',
      title: { en: 'Reduce salt intake', ny: 'Chepetsani mchere' },
      description: {
        en: 'Use less salt in cooking and avoid processed foods like crisps and canned goods.',
        ny: 'Gwiritsani mchere wochepa pophika ndi kupewa zakudya zokonzedwa monga ma crisps ndi za m’matumba.',
      },
      category: 'diet',
    },
    {
      id: 'hp2',
      title: { en: 'Take blood pressure medication', ny: 'Imwani mankhwala a BP' },
      description: {
        en: 'Take prescribed medication every day, even if you feel fine. High BP often has no symptoms.',
        ny: 'Imwani mankhwala tsiku lililonse, ngakhale mutamva bwino. BP yayikulu nthawi zambiri ilibe zizindikiro.',
      },
      category: 'medical',
    },
    {
      id: 'hp3',
      title: { en: 'Stay physically active', ny: 'Khalani achangu' },
      description: {
        en: 'Aim for 30 minutes of moderate activity most days of the week.',
        ny: 'Yesetsani kuchita zolimbitsa thupi mphindi 30 masiku ambiri a mlungu.',
      },
      category: 'lifestyle',
    },
    {
      id: 'hp4',
      title: { en: 'Limit alcohol and quit smoking', ny: 'Chepetsani mowa ndi kusiya kusuta' },
      description: {
        en: 'Both raise blood pressure significantly. Seek support to quit.',
        ny: 'Zonse ziwiri zimakweza BP kwambiri. Funsani thandizo kuti musiye.',
      },
      category: 'lifestyle',
    },
    {
      id: 'hp5',
      title: { en: 'Check your BP regularly', ny: 'Yesetsani kuyeza BP pafupipafupi' },
      description: {
        en: 'Have your blood pressure measured at least every few months.',
        ny: 'Yesetsani kuyeza BP miyezi ingapo iliyonse.',
      },
      category: 'medical',
    },
  ],
  cholera: [
    {
      id: 'ch1',
      title: { en: 'Rehydrate immediately with ORS', ny: 'Mwangwa ORS mwamsanga' },
      description: {
        en: 'Cholera causes rapid fluid loss. Start oral rehydration salts (ORS) immediately and go to a clinic.',
        ny: 'Kolera imachititsa kutaya madzi mwamsanga. Yambani ORS nthawi yomweyo ndi kupita ku chipatala.',
      },
      category: 'medical',
    },
    {
      id: 'ch2',
      title: { en: 'Seek urgent medical care', ny: 'Funsani chithandizo mwamsanga' },
      description: {
        en: 'Cholera can be fatal within hours if untreated. Do not delay — go to the nearest health facility.',
        ny: 'Kolera ikhoza kupha mkati mwa maola ngati sinathandizidwe. Musachedwe — pitani ku chipatala chapafupi.',
      },
      category: 'medical',
    },
    {
      id: 'ch3',
      title: { en: 'Drink only safe water', ny: 'Imwani madzi abwino okha' },
      description: {
        en: 'Boil, chlorinate, or filter all drinking water. Avoid untreated water sources.',
        ny: 'Wiritsani, thirani chlorine, kapena seferani madzi onse omwe mumamwa. Pewani madzi osathandizidwa.',
      },
      category: 'hygiene',
    },
    {
      id: 'ch4',
      title: { en: 'Wash hands with soap and safe water', ny: 'Sambani manja ndi sopo ndi madzi abwino' },
      description: {
        en: 'Wash thoroughly after using the toilet and before preparing or eating food.',
        ny: 'Sambani bwino pambuyo pa chimbudzi komanso musanakonze kapena musanadye chakudya.',
      },
      category: 'hygiene',
    },
    {
      id: 'ch5',
      title: { en: 'Dispose of waste safely', ny: 'Tayani zinyalala motetezeka' },
      description: {
        en: 'Use latrines. Keep drinking water sources away from toilets and waste.',
        ny: 'Gwiritsani ntchito zimbudzi. Khalani kutali ndi magwero a madzi omwe mumamwa ndi zimbudzi.',
      },
      category: 'environment',
    },
    {
      id: 'ch6',
      title: { en: 'Cook food thoroughly and eat it hot', ny: 'Phikani chakudya bwino ndi kudya chotentha' },
      description: {
        en: 'Avoid raw or undercooked food, especially seafood and street food.',
        ny: 'Pewani zakudya zosaphika kapena zophika pang’ono, makamaka nsomba ndi zakudya za m’misewu.',
      },
      category: 'diet',
    },
  ],
};

const GENERIC_PREVENTION: PreventionItem[] = [
  {
    id: 'gen1',
    title: { en: 'Consult a health worker', ny: 'Funsani wothandizira wa zaumoyo' },
    description: {
      en: 'Visit your nearest clinic for proper diagnosis and treatment.',
      ny: 'Pitani ku chipatala chapafupi kuti muyezedwe ndi kuthandizidwa bwino.',
    },
    category: 'medical',
  },
  {
    id: 'gen2',
    title: { en: 'Rest and hydrate', ny: 'Pumulani ndi kumwa madzi' },
    description: {
      en: 'Drink plenty of safe water and get adequate rest.',
      ny: 'Mwangwanthawi zonse madzi abwino ndi kupuma mokwanira.',
    },
    category: 'lifestyle',
  },
  {
    id: 'gen3',
    title: { en: 'Monitor your symptoms', ny: 'Yang’anirani zizindikiro zanu' },
    description: {
      en: 'If symptoms worsen, seek care immediately.',
      ny: 'Ngati zizindikiro zikuipiraipira, funsani chithandizo mwamsanga.',
    },
    category: 'medical',
  },
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