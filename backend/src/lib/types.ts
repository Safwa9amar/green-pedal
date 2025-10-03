export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type Station = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  bikesAvailable: number;
};

export type Bike = {
  id: string;
  qrCode: string;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
  batteryLevel: number;
  stationId: string | null;
  stationName?: string;
};

export type Rental = {
  id: string;
  userId: string;
  bikeId: string;
  startTime: Date;
  endTime: Date | null;
  cost: number | null;
  status: "ACTIVE" | "COMPLETED";
  userName: string;
};

export type Stat = {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: "increase" | "decrease";
};

export type StationFormData = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
};
