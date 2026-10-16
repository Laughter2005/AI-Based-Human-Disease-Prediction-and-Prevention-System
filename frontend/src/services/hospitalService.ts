import api from './api';

export interface Hospital {
  id: string;
  name: string;
  type: string;
  district: string;
  region: string;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  services: string[];
  distance_km: number | null;
}

export interface HospitalQuery {
  lat?: number;
  lng?: number;
  district?: string;
  region?: string;
  type?: string;
  limit?: number;
}

export const hospitalService = {
  async list(query: HospitalQuery = {}): Promise<Hospital[]> {
    const { data } = await api.get<Hospital[]>('/hospitals', { params: query });
    return data;
  },
};

/**
 * Ask the browser for the user's current coordinates.
 * Returns null if the user denies permission or the browser doesn't support it.
 */
export function getUserLocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 60000 }
    );
  });
}