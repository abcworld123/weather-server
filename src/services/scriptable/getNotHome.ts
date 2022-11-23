import { spawn } from 'child_process';
import { getRegionName } from 'services/get/kakao';
import { getAll } from 'services/get/ow';
import { logError } from 'utils/logger';
import type { PythonResult } from 'types/apis';

function python(region: string) {
  return new Promise<PythonResult>((resolve, reject) => {
    const process = spawn('python', ['get_with_bs.py', region]);
    process.stdout.on('data', (data) => {
      const ret = {
        success: true,
        data: data.toString(),
      };
      resolve(ret);
    });
    process.stderr.on('data', (data) => {
      reject(data.toString());
    });
  });
}

export default async function getNotHome(lat: string, lon: string) {
  try {
    const region = await getRegionName(lat, lon);
    const { data: data1, success: success1 } = await getAll(lat, lon);
    if (!success1) throw new Error('getAll error');
    const { data: data2, success: success2 } = await python(region);
    if (!success2) throw new Error('python error');
    const data = data1;

    // replace current
    data.current.weather[0].id = 10;  // todo edit
    data.current.weather[0].description = data2.current.sky;
    data.current.temp = data2.current.temp;
    data.current.feels_like = data2.current.feelTemp;
    data.current.humidity = data2.current.humid;
    data.current.wind_speed = data2.current.wind;
    data.current.rain = data2.current.rain;
    data.hourly[0].temp = data.current.temp;

    // replace hourly
    for (let i = 1; i < 10; ++i) {
      data.hourly[i].weather[i].id = 10;
      data.hourly[i].weather[i].description = data2.hourly.skys[i - 1];
      data.hourly[i].temp = data2.hourly.temps[i - 1];
    }

    // replace current
    for (let i = 1; i < 14; ++i) {
      // data.daily[i].weather[i].id = 10;
      // data.daily[i].weather[i].description = data2.daily.skys[i - 1];
      // data.daily[i].weather[i].ska = data2.daily.skys[2 * i];
      // data.daily[i].weather[i].skp = data2.daily.skys[2 * i + 1];
      data.daily[i].weather[i].ska = 30;
      data.daily[i].weather[i].skp = 30;
      data.daily[i].temp.min = data2.daily.mins[i - 1];
      data.daily[i].temp.max = data2.daily.maxs[i - 1];
    }
    data.region = region;
    return { success: true, data };
  } catch (err) {
    logError('getWithBs', err);
    return { success: false };
  }
}


const skyCode = {
  '맑음': '10',
  '구름많음': '30',
  '흐림': '40',
  '빗방울': '35',
  // '빗방울': '45',
  '눈날림': '37',
  // '눈날림': '47',
  '빗방울 눈날림': '36',
  // '빗방울 눈날림': '46',
  '소나기': '34',
  // '소나기': '44',
  '흐리고 비': '31',
  '비': '41',
  '눈': '33',
  // '눈': '43',
  '비 / 눈': '32',
  // '비 / 눈': '42',
};
