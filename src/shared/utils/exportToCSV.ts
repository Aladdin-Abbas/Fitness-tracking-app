import * as FileSystem from 'expo-file-system';
import { HistoryActivity } from '../../features/history/types';

export const exportToCSV = async (activities: HistoryActivity[]) => {
  try {
    const headers = 'Date,Type,Duration,Steps,Calories\n';
    const csvData = activities
      .map(activity => (
        `${activity.date},${activity.type},${activity.duration},${activity.steps},${activity.calories}`
      ))
      .join('\n');

    const csvContent = `${headers}${csvData}`;
    const fileName = `fitness_activities_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8
    });

    console.log(`CSV file saved successfully at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('Error exporting activities:', error);
    throw error;
  }
};