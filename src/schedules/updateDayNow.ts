import config from 'config';
import { pool } from 'libs/db';
import { getDayNow } from 'services/get/kma';
import { getDateTime } from 'utils/datetime';
import { logError } from 'utils/logger';
import type { ResultSetHeader } from 'mysql2';
import type { DayNow } from 'types/db';

export default async function updateDayNow() {
  const conn = await pool.getConnection();
  try {
    const { dt } = getDateTime('0000', '0100', '0030');
    const res = await getDayNow(nx, ny);
    if (!res.success) throw new Error('now get failed');
    const data: Record<string, DayNow> = {};
    for (const x of res.data) {
      const cate = x.category;
      if (exclude.includes(cate)) continue;
      if (!data[dt]) data[dt] = {};
      data[dt][cate] = x.obsrValue;
    }
    const { dt: dtHour } = getDateTime('0000', '0100', '0000');
    await conn.beginTransaction();
    for (const e of Object.values(data)) {
      const [rows, fields] = await conn.execute<ResultSetHeader>('UPDATE `hourly` SET POP=?, PTY=?, REH=?, TMP=?, WSD=? WHERE dt=?', [e.RN1, e.PTY, e.REH, e.T1H, e.WSD, dtHour]);
      if (rows.affectedRows === 0) {
        const [rows, fields] = await conn.execute<ResultSetHeader>('INSERT INTO `hourly` (dt, POP, PTY, REH, TMP, WSD) VALUES (?, ?, ?, ?, ?, ?)', [dtHour, e.RN1, e.PTY, e.REH, e.T1H, e.WSD]);
      }
    }
    await conn.commit();
    return true;
  } catch (err) {
    logError('updateDayNow', err);
    return false;
  } finally {
    conn.release();
  }
}

const nx = config.reg.nx;
const ny = config.reg.ny;
const exclude = ['UUU', 'VEC', 'VVV'];
