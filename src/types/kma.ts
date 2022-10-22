import type { ResDefault } from 'types/apis';

// responses
export type ResKmaDayNow = ResKmaApi<KmaDayNowData>;
export type ResKmaDayShort = ResKmaApi<KmaDayShortData>;
export type ResKmaDayLong = ResKmaApi<KmaDayLongData>;
export type ResKmaWeekTa = ResKmaApi<KmaWeekTaData>;
export type ResKmaWeekMl = ResKmaApi<KmaWeekMlData>;

interface KmaDefaultParams {
  serviceKey: string;
  pageNo?: string | number;
  numOfRows?: string | number;
  dataType?: 'json' | 'xml';
}

export interface KmaDayParams extends KmaDefaultParams {
  base_date: string;
  base_time: string;
  nx: string | number;
  ny: string | number;
}

export interface KmaWeekParams extends KmaDefaultParams {
  regId: string;
  tmFc: string;
}

interface ResKmaApi<T> {
  response: {
    header: {
      resultCode: ResultCode;
      resultMsg: ResultMsg;
    };
    body?: {
      dataType: 'JSON' | 'XML';
      items: {
        item: T[];
      };
      pageNo: number;
      nomOfRows: number;
      totalCount: number;
    };
  };
}

interface KmaDayDefault {
  baseDate: string;
  baseTime: string;
  nx: number;
  ny: number;
  category: string;
}

interface KmaWeekDefault {
  regId: string;
  date: string;  // 내가 추가함
}

// 초단기실황
interface KmaDayNowData extends KmaDayDefault {
  category: 'PTY' | 'REH' | 'RN1' | 'T1H' | 'UUU' | 'VEC' | 'VVV' | 'WSD';
  obsrValue: string;
}
// 초단기예보
interface KmaDayShortData extends KmaDayDefault {
  category: 'LGT' | 'PTY' | 'RN1' | 'SKY' | 'T1H' | 'REH' | 'UUU' | 'VVV' | 'VEC' | 'WSD';
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
}

// 단기예보
interface KmaDayLongData extends KmaDayDefault {
  category: 'TMP' | 'UUU' | 'VVV' | 'VEC' | 'WSD' | 'SKY' | 'PTY' | 'POP' | 'WAV' | 'PCP' | 'REH' | 'SNO' | 'TMN' | 'TMX';
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
}

// 중기기온예보
interface KmaWeekTaData extends KmaWeekDefault {
  taMin3: number;
  taMin3Low: number;
  taMin3High: number;
  taMax3: number;
  taMax3Low: number;
  taMax3High: number;
  taMin4: number;
  taMin4Low: number;
  taMin4High: number;
  taMax4: number;
  taMax4Low: number;
  taMax4High: number;
  taMin5: number;
  taMin5Low: number;
  taMin5High: number;
  taMax5: number;
  taMax5Low: number;
  taMax5High: number;
  taMin6: number;
  taMin6Low: number;
  taMin6High: number;
  taMax6: number;
  taMax6Low: number;
  taMax6High: number;
  taMin7: number;
  taMin7Low: number;
  taMin7High: number;
  taMax7: number;
  taMax7Low: number;
  taMax7High: number;
  taMin8: number;
  taMin8Low: number;
  taMin8High: number;
  taMax8: number;
  taMax8Low: number;
  taMax8High: number;
  taMin9: number;
  taMin9Low: number;
  taMin9High: number;
  taMax9: number;
  taMax9Low: number;
  taMax9High: number;
  taMin10: number;
  taMin10Low: number;
  taMin10High: number;
  taMax10: number;
  taMax10Low: number;
  taMax10High: number;
}

// 중기육상예보
interface KmaWeekMlData extends KmaWeekDefault {
  rnSt3Am: number;
  rnSt3Pm: number;
  rnSt4Am: number;
  rnSt4Pm: number;
  rnSt5Am: number;
  rnSt5Pm: number;
  rnSt6Am: number;
  rnSt6Pm: number;
  rnSt7Am: number;
  rnSt7Pm: number;
  rnSt8Am: number;  // 내가 추가함
  rnSt8Pm: number;  // 내가 추가함
  rnSt9Am: number;  // 내가 추가함
  rnSt9Pm: number;  // 내가 추가함
  rnSt10Am: number;  // 내가 추가함
  rnSt10Pm: number;  // 내가 추가함
  rnSt8: number;
  rnSt9: number;
  rnSt10: number;
  wf3Am: string;
  wf3Pm: string;
  wf4Am: string;
  wf4Pm: string;
  wf5Am: string;
  wf5Pm: string;
  wf6Am: string;
  wf6Pm: string;
  wf7Am: string;
  wf7Pm: string;
  wf8: string;
  wf9: string;
  wf10: string;
}

// response code
type ResultCode = (
  | '00'
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '10'
  | '11'
  | '12'
  | '20'
  | '21'
  | '22'
  | '30'
  | '31'
  | '32'
  | '33'
  | '99'
);

// response message
type ResultMsg = (
  | 'NORMAL_SERVICE'
  | 'APPLICATION_ERROR'
  | 'DB_ERROR'
  | 'NODATA_ERROR'
  | 'HTTP_ERROR'
  | 'SERVICETIME_OUT'
  | 'INVALID_REQUEST_PARAMETER_ERROR'
  | 'NO_MANDATORY_REQUEST_PARAMETERS_ERROR'
  | 'NO_OPENAPI_SERVICE_ERROR'
  | 'SERVICE_ACCESS_DENIED_ERROR'
  | 'TEMPORARILY_DISABLE_THE_SERVICEKEY_ERROR'
  | 'LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR'
  | 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR'
  | 'DEADLINE_HAS_EXPIRED_ERROR'
  | 'UNREGISTERED_IP_ERROR'
  | 'UNSIGNED_CALL_ERROR'
  | 'UNKNOWN_ERROR'
);
