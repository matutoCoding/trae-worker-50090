import { EnvironmentData } from '@/types';

const generateHourlyData = (sectionId: string, hours: number = 24): EnvironmentData[] => {
  const data: EnvironmentData[] = [];
  const now = new Date();
  
  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      id: `${sectionId}-${i}`,
      sectionId,
      timestamp: time.toISOString(),
      temperature: 18 + Math.random() * 8 + Math.sin(i / 4) * 2,
      humidity: 55 + Math.random() * 15 + Math.cos(i / 3) * 5,
      oxygen: 20.5 + Math.random() * 0.8,
      ch4: Math.random() * 0.05,
      co: Math.random() * 8,
      h2s: Math.random() * 2,
      smoke: Math.random() > 0.98,
      waterlogging: Math.random() > 0.99
    });
  }
  
  return data;
};

export const environmentData: Record<string, EnvironmentData[]> = {
  '1': generateHourlyData('1'),
  '2': generateHourlyData('2'),
  '3': generateHourlyData('3'),
  '4': generateHourlyData('4'),
  '5': generateHourlyData('5'),
  '6': generateHourlyData('6'),
};

export const getLatestData = (sectionId: string): EnvironmentData | null => {
  const data = environmentData[sectionId];
  return data && data.length > 0 ? data[data.length - 1] : null;
};

export const getThresholds = () => ({
  temperature: { min: 5, max: 35, warningMin: 10, warningMax: 30 },
  humidity: { min: 30, max: 80, warningMin: 40, warningMax: 70 },
  oxygen: { min: 19.5, max: 23.5, warningMin: 20, warningMax: 23 },
  ch4: { max: 0.25, warning: 0.1 },
  co: { max: 24, warning: 16 },
  h2s: { max: 10, warning: 6 },
});
