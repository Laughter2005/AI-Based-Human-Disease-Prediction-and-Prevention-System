import api from './api';

export interface BilingualText {
  en: string;
  ny: string;
}

export interface BilingualList {
  en: string[];
  ny: string[];
}

export interface DiseaseInfo {
  key: string;
  name: BilingualText;
  description: BilingualText;
  transmission: BilingualText;
  typical_symptoms: BilingualList;
  when_to_seek_care: BilingualText;
  complications: BilingualText;
}

export const infoService = {
  async getDiseaseInfo(name: string): Promise<DiseaseInfo> {
    const key = name.toLowerCase().trim();
    const { data } = await api.get<DiseaseInfo>(`/diseases/${encodeURIComponent(key)}`);
    return data;
  },
};