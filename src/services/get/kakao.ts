import axios from 'axios';
import config from 'config';
import { logError } from 'utils/logger';
import type { ResKakaoRegion } from 'types/kakao';

const url = 'http://dapi.kakao.com/v2/local/geo/coord2regioncode.json';

export async function getRegionName(lat: string, lon: string) {
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
    return ret.address_name;
  } catch (err) {
    logError('getRegionName', err);
    return '';  //
  }
}
