import api from './api';
import type { PredictionRequest, PredictionResult } from '../types/prediction.types';
import type { ApiResponse } from '../types/api.types';

export const predictionService = {
  async predict(payload: PredictionRequest): Promise<PredictionResult> {
    const { data } = await api.post<ApiResponse<PredictionResult>>(
      '/predictions',
      payload
    );
    return data.data;
  },

  async getHistory(): Promise<PredictionResult[]> {
    const { data } = await api.get<ApiResponse<PredictionResult[]>>(
      '/predictions/history'
    );
    return data.data;
  },
};