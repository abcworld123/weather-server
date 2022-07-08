import axios from 'axios';
import config from 'config';
import response from 'services/response';
import type {
  ResKmaWeatherDay,
  ResKmaWeatherMl,
  ResKmaWeatherTa,
  KmaWeekBody,
  KmaDayBody,
} from 'types/weather';

const baseUrl = 'http://apis.data.go.kr/1360000/';

export async function getWeatherDay(idx: number, nx: number, ny: number) {
  const url = baseUrl + 'VilageFcstInfoService_2.0/getVilageFcst';
  let sec = new Date().getTime() + 25200000;
  sec += -sec % 10800000 + 7200000;
  const now = new Date(sec).toISOString().replace(/[T\-:]|\..+/g, '');
  const base_date = now.substring(0, 8);
  const base_time = now.substring(8, 12);
  const category = ['', 'TMP', 'REH', 'WSD', 'SKY'];
  const params: KmaDayBody = {
    serviceKey: config.weather.key,
    pageNo: 1,
    numOfRows: 84,
    dataType: 'json',
    base_date,
    base_time,
    nx,
    ny,
  };
  try {
    const { data } = await axios.get<ResKmaWeatherDay>(url, { params });
    const items = data.response.body.items.item;
    const arr = items
      .filter((x) => x.category === category[idx])
      .map((x) => parseInt(x.fcstValue));
    return response(true, arr);
  } catch (err) {
    console.error(err);
    return response(false);
  }
}

export async function getWeatherTa(idx: number, reg: number) {
  const url = baseUrl + 'MidFcstInfoService/getMidTa';
  let sec = new Date().getTime() + 10800000;
  sec += -sec % 43200000 + 21600000;
  const now = new Date(sec).toISOString().replace(/[T\-:]|\..+/g, '').substring(0, 12);
  const regCodes = ['', '11B10101', '11H20201', '11H10701', '11B20201', '11C20401', '11F20501', '11H20101'];
  const taTarget = ['taMax', 'taMin'][idx - 5];
  const arr: number[] = [];
  const params: KmaWeekBody = {
    serviceKey: config.weather.key,
    dataType: 'json',
    regId: regCodes[reg],
    tmFc: now,
  };
  try {
    const { data } = await axios.get<ResKmaWeatherTa>(url, { params });
    const item = data.response.body.items.item[0];
    for (let i = 3; i < 10; i++) {
      arr.push(item[`${taTarget}${i}`]);
    }
    return response(true, arr);
  } catch (err) {
    console.error(err);
    return response(false);
  }
}

export async function getWeatherMl(idx: number, reg: number) {
  const url = baseUrl + 'MidFcstInfoService/getMidLandFcst';
  let sec = new Date().getTime() + 10800000;
  sec += -sec % 43200000 + 21600000;
  const now = new Date(sec).toISOString().replace(/[T\-:]|\..+/g, '').substring(0, 12);
  const regId = ['', '11B00000', '11H20000', '11H10000', '11B00000', '11C20000', '11F20000', '11H20000'];
  let arr: number[] = [];
  const params: KmaWeekBody = {
    serviceKey: config.weather.key,
    dataType: 'json',
    regId: regId[reg],
    tmFc: now,
  };
  try {
    const { data } = await axios.get<ResKmaWeatherMl>(url, { params });
    const item = data.response.body.items.item[0];
    arr = [
      item.rnSt3Pm,
      item.rnSt4Pm,
      item.rnSt5Pm,
      item.rnSt6Pm,
      item.rnSt7Pm,
      item.rnSt8,
      item.rnSt9,
    ];
    return response(true, arr);
  } catch (err) {
    console.error(err);
    return response(false);
  }
}
