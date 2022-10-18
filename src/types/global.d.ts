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
      MYSQL_HOST: string;
      MYSQL_USER: string;
      MYSQL_PASSWORD: string;
      MYSQL_DATABASE: string;
    }
  }
  // express
  type Request<T extends RequestData = any> = ExpressRequest<T['params'], null, T['body'], T['query']>;
  type Response<T extends ResponseData = any> = ExpressResponse<T>;
  type NextFunction = ExpressNextFunction;
}
