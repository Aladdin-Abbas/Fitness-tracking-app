// export interface Activity {
//   id: number;
//   type: string;
//   duration: string;
//   calories: number;
//   steps: number;
//   date: string;
//   time?: string;
// }

// export interface DailyStats {
//   steps: number;
//   distance: string;
//   calories: number;
//   activeTime: string;
// }

export interface ActivityCardProps {
  id: number;
  type: string;
  duration: string;
  calories: number;
  date: string;
}

export interface DashboardCardProps {
  dailySteps: number;
  dailyGoal: number;
  activities: Array<{
    date: string | number | Date;
    type: string;
    duration: string;
    calories: number;
    steps: number;
  }>;
}