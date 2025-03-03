export interface HistoryActivity {
  id: number;
  date: string;
  type: string;
  duration: string;
  calories: number;
  steps: number;
}

export interface MarkedDates {
  [key: string]: { marked: boolean; selected?: boolean };
}

export interface ExportData {
  date: string;
  type: string;
  duration: string;
  steps: number;
  calories: number;
}