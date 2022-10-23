interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
  ska: number;  // 내가 추가함
  skp: number;  // 내가 추가함
}

interface Temp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

interface FeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

interface Current {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: Weather[];
  rain: number;  // 내가 추가함
}

interface Hourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  pop: number;
}

interface Daily {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: Temp;
  feels_like: FeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  clouds: number;
  pop: number;
  uvi: number;
}

export interface ResOwAll {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: string;
  current: Current;
  hourly: Hourly[];
  daily: Daily[];
  region: string;  // 내가 추가함
}
