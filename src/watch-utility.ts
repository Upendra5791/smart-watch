export interface Weather {
  available: boolean;
  temperature: number;
  weatherCode: number;
}

export interface RotationDegrees {
  secRotateDeg: number;
  minRotateDeg: number;
  hourRotateDeg: number;
}

export interface HandTransition {
  secHand: string;
  minHand: string;
  hourHand: string;
}

export interface Now {
  day: number,
  date: number,
  hour: number,
  min: number,
  sec: number
}

export enum days {
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
}

export const theme = [
  '#cacaca',
  '#f44336',
  '#ffc107',
  '#f44336',
  '#e91e63',
  '#673ab7',
  '#ff9800',
  '#00bcd4',
  '#cddc39',
  '#009688',
  '#ffc107',
  '#795548',
  '#4caf50',
  '#ff9800',
  '#ffeb3b',
  '#2196f3',
  '#795548',
  '#607d8b',
];

export const weatherCodeMap = [
  { key: 0, val: 'Clear sky' },
  { key: 1, val: 'Mainly clear' },
  { key: 2, val: 'Partly cloudy' },
  { key: 3, val: 'Overcast' },
  { key: 45, val: 'Fog' },
  { key: 48, val: 'Fog' },
  { key: 51, val: 'Light drizzle' },
  { key: 53, val: 'Moderate drizzle' },
  { key: 55, val: 'Dense drizzle' },
  { key: 56, val: 'Light drizzle' },
  { key: 57, val: 'Dense drizzle' },
  { key: 61, val: 'Light rain' },
  { key: 63, val: 'Moderate rain' },
  { key: 65, val: 'Heavy rain' },
  { key: 66, val: 'Light rain' },
  { key: 67, val: 'Heavy rain' },
  { key: 71, val: 'Light snow' },
  { key: 73, val: 'Moderate snow' },
  { key: 75, val: 'Heavy snow' },
  { key: 77, val: 'Snow' },
  { key: 80, val: 'Light shower' },
  { key: 81, val: 'Moderate shower' },
  { key: 82, val: 'Violent shower' },
  { key: 85, val: 'Snow shower' },
  { key: 86, val: 'Snow shower' },
];
