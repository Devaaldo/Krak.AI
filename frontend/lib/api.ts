import axios from 'axios';
import { API_BASE } from './constants';
import type { PredictResult } from './types';

export const api = axios.create({ baseURL: API_BASE });

export async function predictImage(file: File): Promise<PredictResult> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<PredictResult>('/predict', formData);
  return data;
}
