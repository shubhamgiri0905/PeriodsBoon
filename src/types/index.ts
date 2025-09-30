export interface User {
  id: string;
  email: string;
  username: string;
  avgCycleLength: number;
  avgPeriodLength: number;
  createdAt: Date;
}

export interface CycleData {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  predictedPeriodLength: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  periodFlow: 'none' | 'light' | 'medium' | 'heavy';
  symptoms: string[];
  moods: string[];
  notes?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
}

export interface Prediction {
  nextPeriodDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  confidence: number;
}