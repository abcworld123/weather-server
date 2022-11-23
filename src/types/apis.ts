import type { ResOwAll } from './ow';

// get params, post body types


// request types
export interface ReqScriptableGet {
  query: {
    lat: string;
    lon: string;
  };
}

// response types
export interface ResDefault {
  success: boolean;
  data?: any;
}

export interface ResWithOwGet extends ResDefault {
  data?: ResOwAll;
}

// export interface ResKmaGet extends ResDefault {
// }

// ! express default
export interface RequestData {
  params?: any;
  body?: any;
  query?: any;
}

export interface ResponseData {
  // data?: any;
}

// python
interface Current {
  sky: string;
  temp: number;
  feelTemp: number;
  humid: number;
  wind: number;
  rain: number;
}

interface Hourly {
  skys: string[];
  temps: number[];
}

interface Daily {
  skys: string[];
  mins: number[];
  maxs: number[];
}

export interface PythonResult extends ResDefault {
  data?: {
    current: Current;
    hourly: Hourly;
    daily: Daily;
  };
}
