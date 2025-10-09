export interface Bike {
  id: number;
  stationId: number;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
  currentLocationLat: number;
  currentLocationLng: number;
  station?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    capacity: number;
    bikes: Bike[];
  };
  photo: any;
  name: string;
  type: string;
  batteryTime: string;
  batteryLevel: string;
  specs: BikeSpecs[];
}
export interface BikeSpecs {
  icon: string;
  label: string;
  value: string;
}
export interface Rental {
  id: number;
  userId: number;
  bikeId: number;
  startTime: string;
  endTime?: string;
  totalCost?: number;
  status: "ONGOING" | "COMPLETED";
  bike?: Bike;
}
