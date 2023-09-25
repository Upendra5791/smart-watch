export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  min: number;
  max: number;
  sunrise: Date;
  sunset: Date;
}

export interface HourlyWeather {
  time: number;
  temperature: number;
}

export interface IDailyWeather {
  day: Date;
  maxTemperature: number;
  minTemperature: number;
}

export interface Weather {
  available: boolean;
  currentWeather: CurrentWeather;
  hourly: HourlyWeather[];
  daily: IDailyWeather[];
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
  day: number;
  date: number;
  hour: number;
  min: number;
  sec: number;
}

export interface Touch {
  x: number;
  y: number;
  timeStamp: number;
  mouseState: "UP" | "DOWN";
}

export enum days {
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
}

export const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const theme = [
  "#cacaca",
  "#f44336",
  "#ffc107",
  "#f44336",
  "#e91e63",
  "#673ab7",
  "#ff9800",
  "#00bcd4",
  "#cddc39",
  "#009688",
  "#ffc107",
  "#795548",
  "#4caf50",
  "#ff9800",
  "#ffeb3b",
  "#2196f3",
  "#795548",
  "#607d8b",
];

export const weatherCodeMap = [
  { key: 0, val: "Clear sky", icon: "&#x263C;" },
  { key: 1, val: "Mainly clear", icon: "&#x2600;" },
  { key: 2, val: "Partly cloudy", icon: "&#x26C5;" },
  { key: 3, val: "Overcast", icon: "&#x2601;" },
  { key: 45, val: "Fog", icon: "&#x1F301;" },
  { key: 48, val: "Fog", icon: "&#x1F301;" },
  { key: 51, val: "Light drizzle", icon: "&#x1F327;" },
  { key: 53, val: "Moderate drizzle", icon: "&#x1F327;" },
  { key: 55, val: "Dense drizzle", icon: "&#x2614;" },
  { key: 56, val: "Light drizzle", icon: "&#x1F327;" },
  { key: 57, val: "Dense drizzle", icon: "&#x2614;" },
  { key: 61, val: "Light rain", icon: "&#x2614;" },
  { key: 63, val: "Moderate rain", icon: "&#x2614;" },
  { key: 65, val: "Heavy rain", icon: "&#x2614;" },
  { key: 66, val: "Light rain", icon: "&#x2614;" },
  { key: 67, val: "Heavy rain", icon: "&#x2614;" },
  { key: 71, val: "Light snow", icon: "&#x26C4;" },
  { key: 73, val: "Moderate snow", icon: "&#x26C4;" },
  { key: 75, val: "Heavy snow", icon: "&#x2603;" },
  { key: 77, val: "Snow", icon: "&#x26C4;" },
  { key: 80, val: "Light shower", icon: "&#x2614;" },
  { key: 81, val: "Moderate shower", icon: "&#x2614;" },
  { key: 82, val: "Violent shower", icon: "&#x2614;" },
  { key: 85, val: "Snow shower", icon: "&#x26C4;" },
  { key: 86, val: "Snow shower", icon: "&#x26C4;" },
];

export const getWeatherIconString = (key = 0, su = 6, sd = 6) => {
  const isDay = new Date().getHours() > su && new Date().getHours() < sd;
  let img = '';
  switch(key) {
      case 0:
      case 1:
          img = isDay ? 'sunny_weather' : 'clear_night_weather';
          break;
      case 2:
          img = isDay ? 'sunny_cloudy_weather' : 'fog_night_weather';
          break;
      case 3:
          img = 'overcast_weather';
          break;
      case 45:
      case 48:
          img = isDay ? 'fog_sunny_weather' : 'fog_night_weather';
          break;
      case 51:
      case 53:
      case 56:
          img = 'rain_weather';
          break;
      case 55:
      case 57:
      case 61:
      case 63:
      case 65:
      case 66:
      case 67:
      case 80:
      case 81:
      case 82:
          img = 'heavy_rain_weather';
          break;
      case 71:
      case 73:
      case 77:
      case 85:
      case 86:
          img = 'snow_weather';
          break;
      case 75:
          img = 'snow_weather';
          break;
      default:
          img = 'sunny_weather';
          break;
  }
  return img;
}

const getDailyWeather = (daily: any): IDailyWeather[] => {
  return daily.time
    .filter((f: string) => new Date(f) > new Date())
    .map((t: string, i: number) => {
      return {
        day: new Date(t),
        max: daily.temperature_2m_max[i],
        min: daily.temperature_2m_min[i],
      };
    });
};

const getHourlyWeather = (hourly: any): HourlyWeather[] => {
  const hourlyData: HourlyWeather[] = [];
  for (const hour of hourly.time) {
    if (new Date(hour) > new Date()) {
      hourlyData.push({
        time: new Date(hour).getHours(),
        temperature: hourly.temperature_2m[hourly.time.indexOf(hour)],
      });
      if (hourlyData.length >= 20) break;
    }
  }
  return hourlyData;
};

export const getWeatherDetails = (response: any): Weather => {
  return {
    available: true,
    currentWeather: {
      temperature: response.current_weather?.temperature,
      weatherCode: response.current_weather?.weathercode,
      min: response.daily.temperature_2m_min[0],
      max: response.daily.temperature_2m_max[0],
      sunrise: new Date(response.daily.sunrise[0]),
      sunset: new Date(response.daily.sunset[0]),
    },
    daily: getDailyWeather(response.daily),
    hourly: getHourlyWeather(response.hourly),
  };
};
