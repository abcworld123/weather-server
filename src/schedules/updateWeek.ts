import config from 'config';
import { pool } from 'libs/db';
import { getWeekMl, getWeekTa } from 'services/get/kma';
import { addDay } from 'utils/datetime';
import { logError } from 'utils/logger';
import type { ResultSetHeader } from 'mysql2';

export default async function updateWeek() {
  try {
    const ta = await getWeekTa(taReg);
    const ml = await getWeekMl(mlReg);
    if (!ta.success) throw new Error('ta get failed');
    if (!ml.success) throw new Error('ml get failed');
    const today = ta.data.date;
    const dates = Array.from({ length: 7 }, (v, k) => addDay(today, k + 3));

    const conn = await pool.getConnection();
    await conn.beginTransaction();
    for (let i = 3; i < 7; ++i) {
      const poa = ml.data[`rnSt${i}Am`];
      const pop = ml.data[`rnSt${i}Pm`];
      const ska = skyCode[ml.data[`wf${i}Am`]];
      const skp = skyCode[ml.data[`wf${i}Pm`]];
      const tmn = ta.data[`taMin${i}`];
      const tmx = ta.data[`taMax${i}`];
      const [rows, fields] = await conn.execute<ResultSetHeader>('UPDATE `daily` SET POA=?, POP=?, SKA=?, SKP=?, TMN=?, TMX=? WHERE date=?', [poa, pop, ska, skp, tmn, tmx, dates[i - 3]]);
      if (rows.affectedRows === 0) {
        const [rows, fields] = await conn.execute<ResultSetHeader>('INSERT INTO `daily` VALUES (?, ?, ?, ?, ?, ?, ?)', [dates[i - 3], poa, pop, ska, skp, tmn, tmx]);
      }
    }
    await conn.commit();
    conn.release();
  } catch (err) {
    logError('updateWeek', err);
  }
}

const taReg = config.reg.ta;
const mlReg = config.reg.ml;
const skyCode = {
  '맑음': 10,
  '구름많음': 30,
  '구름많고 비': 31,
  '구름많고 비/눈': 32,
  '구름많고 눈': 33,
  '구름많고 소나기': 34,
  '흐림': 40,
  '흐리고 비': 41,
  '흐리고 비/눈': 42,
  '흐리고 눈': 43,
  '흐리고 소나기': 44,
};
