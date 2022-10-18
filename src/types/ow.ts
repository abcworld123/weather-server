interface Weather {
  id: number;
  main: string;
  icon: string;
  description: string;
}

interface Temp {
  night: number;
  min: number;
  eve: number;
  day: number;
  max: number;
  morn: number;
}

interface FeelsLike {
  night: number;
  eve: number;
  day: number;
  morn: number;
}

interface Current {
  dt: number;
  temp: number;
  humidity: number;
  sunrise: number;
  sunset: number;
  uvi: number;
  wind_deg: number;
  weather: Weather[];
  feels_like: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  pressure: number;
  dew_point: number;
  rain: number;  // 내가 추가함
}

interface Hourly {
  dt: number;
  temp: number;
  humidity: number;
  uvi: number;
  wind_deg: number;
  wind_gust: number;
  feels_like: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  pressure: number;
  dew_point: number;
  weather: Weather[];
  pop: number;
}

interface Daily {
  pop: number;
  dt: number;
  temp: Temp;
  humidity: number;
  sunrise: number;
  sunset: number;
  uvi: number;
  moon_phase: number;
  wind_deg: number;
  wind_gust: number;
  moonset: number;
  feels_like: FeelsLike;
  weather: Weather[];
  wind_speed: number;
  pressure: number;
  moonrise: number;
  dew_point: number;
  clouds: number;
}

export interface OpenWeather {
  hourly: Hourly[];
  current: Current;
  timezone_offset: string;
  daily: Daily[];
  lon: number;
  timezone: string;
  lat: number;
}
