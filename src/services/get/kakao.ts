import axios from 'axios';
import config from 'config';
import { logError } from 'utils/logger';
import type { ResKakaoRegion } from 'types/kakao';

export async function getRegionName(lat: string, lon: string) {
  if (Math.abs((parseFloat(lat) - prev.lat) + (parseFloat(lon) - prev.lon)) <= tol) {
    return prev.region;
  }
  prev.lat = parseFloat(lat);
  prev.lon = parseFloat(lon);
  const params = {
    x: lon,
    y: lat,
  };
  const headers = {
    Authorization: `KakaoAK ${config.key.map}`,
  };
  try {
    const { data } = await axios.get<ResKakaoRegion>(url, { params, headers });
    const ret = data.documents.filter(x => x.region_type === 'H')[0];
    prev.region = ret.address_name;
    return ret.address_name;
  } catch (err) {
    logError('getRegionName', err);
    return homeRegName;
  }
}

const homeRegName = config.reg.homeRegName;
const url = 'http://dapi.kakao.com/v2/local/geo/coord2regioncode.json';
const tol = 0.0001;
const prev = {
  lat: 0,
  lon: 0,
  region: '',
};
