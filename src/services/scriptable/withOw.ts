import { pool } from 'libs/db';
import { getAll } from 'services/get/ow';
import { getDateTime } from 'utils/datetime';
import { logError } from 'utils/logger';
import type { Daily, Hourly } from 'types/db';

export async function getWithOw(lat: number, lon: number) {
  const conn = await pool.getConnection();
  try {
    const [date, time] = getDateTime('0000', '0100', '0000');
    const { data, success } = await getAll(lat, lon);
    if (!success) throw new Error('ow get error');

    const [rowsH, fieldsH] = await conn.execute<Hourly[]>('SELECT * FROM `hourly` WHERE dt >= ?', [date + time]);
    {
      const ow = data.current;
      const kma = rowsH[0];
      ow.temp = parseInt(kma.TMP);
      ow.humidity = parseInt(kma.REH);
      ow.wind_speed = parseFloat(kma.WSD);
      ow.weather[0].id = parseInt(kma.SKY + kma.PTY);
      ow.rain = parseFloat(kma.PCP);
    }
    for (let i = 1; i < Math.min(data.hourly.length + 1, rowsH.length); ++i) {
      const ow = data.hourly[i - 1];
      const kma = rowsH[i];
      ow.temp = parseInt(kma.TMP);
      ow.humidity = parseInt(kma.REH);
      ow.wind_speed = parseFloat(kma.WSD);
      ow.pop = parseInt(kma.POP) / 100;
      ow.weather[0].id = parseInt(kma.SKY + kma.PTY);
    }

    const [rowsD, fieldsD] = await conn.execute<Daily[]>('SELECT * FROM `daily` WHERE date >= ?', [date]);
    for (let i = 0; i < Math.min(data.daily.length, rowsD.length); ++i) {
      const ow = data.daily[i];
      const kma = rowsD[i];
      const sky = Math.max(parseInt(kma.SKA), parseInt(kma.SKP)).toString();
      const pop = Math.max(parseInt(kma.POA), parseInt(kma.POP)).toString();
      ow.temp.min = parseInt(kma.TMN);
      ow.temp.max = parseInt(kma.TMX);
      ow.pop = parseInt(pop) / 100;
      ow.weather[0].id = parseInt(sky);
      ow.weather[0].ska = parseInt(kma.SKA);
      ow.weather[0].skp = parseInt(kma.SKP);
    }
    return { success: true, data };
  } catch (err) {
    logError('getWithOw', err);
    return { success: false };
  } finally {
    conn.release();
  }
}
