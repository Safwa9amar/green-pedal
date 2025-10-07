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

// ✅ Utility to remove duplicates (based on admin_name)
const removeDuplicates = (arr: Wilaya[]) => {
  const seen = new Map<string, Wilaya>();
  arr.forEach((item) => {
    const key = item.admin_name.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, item);
    }
  });
  return Array.from(seen.values());
};

export const useWilayaStore = create<WilayaState>((set) => ({
  // ✅ Load deduplicated data initially
  wilayas: removeDuplicates(data),
  setWilayas: (wilayas) => set({ wilayas: removeDuplicates(wilayas) }),
}));
