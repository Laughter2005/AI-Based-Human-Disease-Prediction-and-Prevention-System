import { useState } from 'react';
import toast from 'react-hot-toast';
import { predictionService } from '../services/predictionService';
import type { PredictionRequest, PredictionResult } from '../types/prediction.types';

export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = async (payload: PredictionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictionService.predict(payload);
      setResult(res);
      return res;
    } catch (e: any) {
      const message =
        e?.response?.data?.detail?.message ||
        e?.response?.data?.detail ||
        e?.message ||
        'Prediction failed';
      setError(typeof message === 'string' ? message : 'Prediction failed');
      toast.error(typeof message === 'string' ? message : 'Prediction failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { predict, loading, result, error, reset };
}