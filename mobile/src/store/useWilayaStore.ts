import { create } from "zustand";
import data from "@/api/dz.json";
export interface Wilaya {
  city: string;
  lat: string;
  lng: string;
  country: string;
  iso2: string;
  admin_name: string;
  capital: string;
  population: string;
  population_proper: string;
}

interface WilayaState {
  wilayas: Wilaya[];
  setWilayas: (wilayas: Wilaya[]) => void;
}

export const useWilayaStore = create<WilayaState>((set) => ({
  wilayas: data,
  setWilayas: (wilayas) => set({ wilayas }),
}));
