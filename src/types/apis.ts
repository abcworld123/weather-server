import type { ResOwAll } from './ow';

// get params, post body types


// request types
export interface ReqScriptableGet {
  query: {
    lat: string;
    lon: string;
    time: string;
    withOw: boolean;
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
