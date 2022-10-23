import config from 'config';
import { pool } from 'libs/db';
import { getDayShort } from 'services/get/kma';
import { getDateTime } from 'utils/datetime';
import { logError } from 'utils/logger';
import type { ResultSetHeader } from 'mysql2';
import type { DayShort } from 'types/db';

export default async function updateDayShort() {
  const conn = await pool.getConnection();
  try {
    const res = await getDayShort(nx, ny);
    if (!res.success) throw new Error('short get failed');
    const data: Record<string, DayShort> = {};
    for (const x of res.data) {
      const cate = x.category;
      if (exclude.includes(cate)) continue;
      const dt = x.fcstDate + x.fcstTime;
      if (!data[dt]) data[dt] = {};
      if (cate === 'RN1') {
        let val = x.fcstValue;
        if (val.includes('없음')) val = '0';
        else if (val.includes('미만')) val = '0.1';
        else if (val.includes('~')) val = '30';
        else if (val.includes('이상')) val = '50';
        else val = val.slice(0, val.length - 2);
        data[dt][cate] = val;
      } else {
        data[dt][cate] = x.fcstValue;
      }
    }
    const { dt: dtNow } = getDateTime('0000', '0100', '0000');
    await conn.beginTransaction();
    for (const [dt, e] of Object.entries(data)) {
      if (dt === dtNow) { e.RN1 = null; e.PTY = null; e.REH = null; e.T1H = null; e.WSD = null; }
      const [rows, fields] = await conn.execute<ResultSetHeader>('UPDATE `hourly` SET LGT=?, PCP=COALESCE(?, PCP), PTY=COALESCE(?, PTY), REH=COALESCE(?, REH), SKY=?, TMP=COALESCE(?, TMP), WSD=COALESCE(?, WSD) WHERE dt=?', [e.LGT, e.RN1, e.PTY, e.REH, e.SKY, e.T1H, e.WSD, dt]);
      if (rows.affectedRows === 0) {
        const [rows, fields] = await conn.execute<ResultSetHeader>('INSERT INTO `hourly` (dt, LGT, PCP, PTY, REH, SKY, TMP, WSD) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [dt, e.LGT, e.RN1, e.PTY, e.REH, e.SKY, e.T1H, e.WSD]);
      }
    }
    await conn.commit();
    return true;
  } catch (err) {
    logError('updateDayShort', err);
    return false;
  } finally {
    conn.release();
  }
}

const nx = config.reg.nx;
const ny = config.reg.ny;
const exclude = ['UUU', 'VEC', 'VVV'];
