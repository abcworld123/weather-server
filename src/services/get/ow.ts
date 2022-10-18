import axios from 'axios';
import config from 'config';
import { logError } from 'utils/logger';
import type { ResOwAll } from 'types/ow';

const url = 'https://api.openweathermap.org/data/2.5/onecall';
const appid = config.key.ow;

export async function getAll(lat: number, lon: number) {
  const params = {
    lat,
    lon,
    exclude: 'minutely,alerts',
    units: 'metric',
    lang: 'ko-Kore_KR',
    appid,
  };
  try {
    const { data } = await axios.get<ResOwAll>(url, { params });
    return { success: true, data };
  } catch (err) {
    logError('OwAll', err);
    return { success: false };
  }
}
