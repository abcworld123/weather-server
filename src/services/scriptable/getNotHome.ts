import { spawn } from 'child_process';
import { getRegionName } from 'services/get/kakao';
import { getAll } from 'services/get/ow';
import { logError } from 'utils/logger';
import type { PythonResult } from 'types/apis';

function python(region: string) {
  return new Promise<PythonResult>((resolve, reject) => {
    const process = spawn('python', ['./src/services/scriptable/get_with_bs.py', region]);
    process.stdout.on('data', (data) => {
      const ret = {
        success: true,
        data: JSON.parse(data.toString()),
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
    data.current.weather[0].id = data2.current.id;
    data.current.weather[0].description = data2.current.sky;
    data.current.temp = data2.current.temp;
    data.current.feels_like = data2.current.feelTemp;
    data.current.humidity = data2.current.humid;
    data.current.wind_speed = data2.current.wind;
    data.current.rain = data2.current.rain;
    data.hourly[0].temp = data.current.temp;

    // replace hourly
    for (let i = 1; i < 10; ++i) {
      data.hourly[i].weather[0].id = data2.hourly.ids[i - 1];
      data.hourly[i].weather[0].description = data2.hourly.skys[i - 1];
      data.hourly[i].temp = data2.hourly.temps[i - 1];
    }

    // replace daily
    for (let i = 0; i < 8; ++i) {
      data.daily[i].weather[0].ska = data2.daily.ids[2 * i];
      data.daily[i].weather[0].skp = data2.daily.ids[2 * i + 1];
      data.daily[i].temp.min = data2.daily.mins[i];
      data.daily[i].temp.max = data2.daily.maxs[i];
    }
    data.region = region;
    return { success: true, data };
  } catch (err) {
    logError('getWithBs', err);
    return { success: false };
  }
}
