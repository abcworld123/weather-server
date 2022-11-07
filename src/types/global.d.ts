import type { RequestData, ResponseData } from './apis';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';

declare global {
  // env
  namespace NodeJS {
    interface ProcessEnv {
      KEY_KMA: string;
      KEY_OW: string;
      KEY_MAP: string;
      MYSQL_HOST: string;
      MYSQL_USER: string;
      MYSQL_PASSWORD: string;
      MYSQL_DATABASE: string;
      NX: string;
      NY: string;
      TA_REG: string;
      ML_REG: string;
      HOME_REG_NAME: string;
    }
  }
  // express
  type Request<T extends RequestData = any> = ExpressRequest<T['params'], null, T['body'], T['query']>;
  type Response<T extends ResponseData = any> = ExpressResponse<T>;
  type NextFunction = ExpressNextFunction;
}
