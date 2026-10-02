import api from './api';

export interface DiseaseCount {
  disease: string;
  count: number;
}

export interface MonthlyPoint {
  month: string;
  predictions: number;
}

export interface UserStats {
  total_predictions: number;
  predictions_this_month: number;
  predictions_last_30_days: number;
  top_diseases: DiseaseCount[];
  monthly_trend: MonthlyPoint[];
  last_prediction_at: string | null;
  first_prediction_at: string | null;
}

export interface DateRangeReport {
  start_date: string;
  end_date: string;
  total_predictions: number;
  unique_users: number;
  top_diseases: DiseaseCount[];
  daily_breakdown: { date: string; count: number }[];
  language_split: Record<string, number>;
}

export interface PublicStats {
  total_users: number;
  total_predictions: number;
  diseases_detected: number;
  supported_languages: number;
}

export const statsService = {
  async me(): Promise<UserStats> {
    const { data } = await api.get<UserStats>('/stats/me');
    return data
  },

  // inside statsService:
async public(): Promise<PublicStats> {
  const { data } = await api.get<PublicStats>('/stats/public');
  return data;
},
  
  async report(startDate: string, endDate: string): Promise<DateRangeReport> {
    const { data } = await api.get<DateRangeReport>('/stats/reports', {
      params: { start_date: startDate, end_date: endDate },
    });
    return data;
  },

  async downloadPredictionsCsv(startDate: string, endDate: string): Promise<void> {
    const res = await api.get('/stats/reports/export/predictions', {
      params: { start_date: startDate, end_date: endDate },
      responseType: 'blob',
    });
    triggerDownload(res.data, `predictions_${startDate}_to_${endDate}.csv`);
  },

  async downloadUsersCsv(): Promise<void> {
    const res = await api.get('/stats/reports/export/users', {
      responseType: 'blob',
    });
    const today = new Date().toISOString().slice(0, 10);
    triggerDownload(res.data, `users_${today}.csv`);
  },
};

function triggerDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}