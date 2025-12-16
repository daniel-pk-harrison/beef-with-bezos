export interface MissedDelivery {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  note: string;
  createdAt: number; // Unix timestamp
}

export interface MissesData {
  misses: MissedDelivery[];
}
