import axios from 'axios';
import config from 'config';
import { getDateTime } from 'utils/datetime';
import { logError } from 'utils/logger';
import type {
  ResKmaDayNow,
  ResKmaDayShort,
  ResKmaDayLong,
  ResKmaWeekMl,
  ResKmaWeekTa,
  KmaWeekParams,
  KmaDayParams,
} from 'types/kma';

const baseUrl = 'http://apis.data.go.kr/1360000/';
const serviceKey = config.key.kma;

export async function getDayNow(nx: number, ny: number) {
  const url = baseUrl + 'VilageFcstInfoService_2.0/getUltraSrtNcst';
  const [baseDate, baseTime] = getDateTime('0000', '0100', '0030');
  const params: KmaDayParams = {
    serviceKey,
    pageNo: 1,
    numOfRows: 10,
    dataType: 'json',
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
  };
  try {
    const { data } = await axios.get<ResKmaDayNow>(url, { params });
    const item = data.response.body.items.item;
    return { success: true, data: item };
  } catch (err) {
    logError('KmaDayNow', err);
    return { success: false };
  }
}

export async function getDayShort(nx: number, ny: number) {
  const url = baseUrl + 'VilageFcstInfoService_2.0/getUltraSrtFcst';
  const [baseDate, baseTime] = getDateTime('0030', '0100', '0100');
  const params: KmaDayParams = {
    serviceKey,
    pageNo: 1,
    numOfRows: 60,
    dataType: 'json',
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
  };
  try {
    const { data } = await axios.get<ResKmaDayShort>(url, { params });
    const item = data.response.body.items.item;
    return { success: true, data: item };
  } catch (err) {
    logError('KmaDayShort', err);
    return { success: false };
  }
}

export async function getDayLong(nx: number, ny: number) {
  const url = baseUrl + 'VilageFcstInfoService_2.0/getVilageFcst';
  const [baseDate, baseTime] = getDateTime('0200', '0300', '0000');
  const params: KmaDayParams = {
    serviceKey,
    pageNo: 1,
    numOfRows: 1000,
    dataType: 'json',
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
  };
  try {
    const { data } = await axios.get<ResKmaDayLong>(url, { params });
    const item = data.response.body.items.item;
    return { success: true, data: item };
  } catch (err) {
    logError('KmaDayLong', err);
    return { success: false };
  }
}

export async function getWeekTa(regId: string) {
  const url = baseUrl + 'MidFcstInfoService/getMidTa';
  const [baseDate, baseTime] = getDateTime('0600', '1200', '0000');
  const params: KmaWeekParams = {
    serviceKey,
    dataType: 'json',
    regId,
    tmFc: baseDate + baseTime,
  };
  try {
    const { data } = await axios.get<ResKmaWeekTa>(url, { params });
    const item = data.response.body.items.item[0];
    item.date = baseDate;
    return { success: true, data: item };
  } catch (err) {
    logError('KmaWeekTa', err);
    return { success: false };
  }
}

export async function getWeekMl(regId: string) {
  const url = baseUrl + 'MidFcstInfoService/getMidLandFcst';
  const [baseDate, baseTime] = getDateTime('0600', '1200', '0000');
  const params: KmaWeekParams = {
    serviceKey,
    dataType: 'json',
    regId,
    tmFc: baseDate + baseTime,
  };
  try {
    const { data } = await axios.get<ResKmaWeekMl>(url, { params });
    const item = data.response.body.items.item[0];
    item.date = baseDate;
    for (let i = 8; i <= 10; ++i) {
      item[`rnSt${i}Am`] = item[`rnSt${i}`];
      item[`rnSt${i}Pm`] = item[`rnSt${i}`];
      item['wf{i}Am'] = item[`wf${i}`];
      item['wf{i}Pm'] = item[`wf${i}`];
    }
    return { success: true, data: item };
  } catch (err) {
    logError('KmaWeekMl', err);
    return { success: false };
  }
}
