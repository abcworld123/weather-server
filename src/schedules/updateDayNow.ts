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
    const [date, time] = getDateTime('0000', '0100', '0030');
    const dt = date + time;
    const res = await getDayNow(nx, ny);
    if (!res.success) throw new Error('now get failed');
    const data: Record<string, DayNow> = {};
    for (const x of res.data) {
      const cate = x.category;
      if (exclude.includes(cate)) continue;
      if (!data[dt]) data[dt] = {};
      data[dt][cate] = x.obsrValue;
    }
    const [_date, _time] = getDateTime('0000', '0100', '0000');
    const _dt = _date + _time;
    await conn.beginTransaction();
    for (const e of Object.values(data)) {
      const [rows, fields] = await conn.execute<ResultSetHeader>('UPDATE `hourly` SET POP=?, PTY=?, REH=?, TMP=?, WSD=? WHERE dt=?', [e.RN1, e.PTY, e.REH, e.T1H, e.WSD, _dt]);
      if (rows.affectedRows === 0) {
        const [rows, fields] = await conn.execute<ResultSetHeader>('INSERT INTO `hourly` (dt, POP, PTY, REH, TMP, WSD) VALUES (?, ?, ?, ?, ?, ?)', [_dt, e.RN1, e.PTY, e.REH, e.T1H, e.WSD]);
      }
    }
    await conn.commit();
  } catch (err) {
    logError('updateDayNow', err);
  } finally {
    conn.release();
  }
}

const nx = config.reg.nx;
const ny = config.reg.ny;
const exclude = ['UUU', 'VEC', 'VVV'];
