import config from 'config';
import { pool } from 'libs/db';
import { getDayLong } from 'services/get/kma';
import { logError } from 'utils/logger';
import type { ResultSetHeader } from 'mysql2';
import type { DayLong } from 'types/db';

export default async function updateDayLong() {
  try {
    const res = await getDayLong(nx, ny);
    if (!res.success) throw new Error('long get failed');
    const data: Record<string, DayLong> = {};
    const tmn: Record<string, string> = {};
    const tmx: Record<string, string> = {};
    for (const x of res.data) {
      const cate = x.category;
      if (exclude.includes(cate)) continue;
      const dt = x.fcstDate + x.fcstTime;
      if (!data[dt]) data[dt] = {};
      if (cate === 'TMN') {
        tmn[x.fcstDate] = x.fcstValue;
      } else if (cate === 'TMX') {
        tmx[x.fcstDate] = x.fcstValue;
      } else if (cate === 'PCP') {
        let val = x.fcstValue;
        if (val.includes('없음')) val = '0';
        else if (val.includes('미만')) val = '0.1';
        else if (val.includes('~')) val = '30';
        else if (val.includes('이상')) val = '50';
        else val = val.slice(0, val.length - 2);
        data[dt][cate] = val;
      } else if (cate === 'SNO') {
        let val = x.fcstValue;
        if (val.includes('없음')) val = '0';
        else if (val.includes('미만')) val = '0.1';
        else if (val.includes('이상')) val = '5';
        else val = val.slice(0, val.length - 2);
        data[dt][cate] = val;
      } else {
        data[dt][cate] = x.fcstValue;
      }
    }
    const conn = await pool.getConnection();
    conn.beginTransaction();
    for (const [dt, e] of Object.entries(data)) {
      const [rows, fields] = await conn.execute<ResultSetHeader>('UPDATE `hourly` SET PCP=?, POP=?, PTY=?, REH=?, SKY=?, SNO=?, TMP=?, WSD=? WHERE dt=?', [e.PCP, e.POP, e.PTY, e.REH, e.SKY, e.SNO, e.TMP, e.WSD, dt]);
      if (rows.affectedRows === 0) {
        const [rows, fields] = await conn.execute<ResultSetHeader>('INSERT INTO `hourly` (dt, PCP, POP, PTY, REH, SKY, SNO, TMP, WSD) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [dt, e.PCP, e.POP, e.PTY, e.REH, e.SKY, e.SNO, e.TMP, e.WSD]);
      }
    }
    conn.commit();
    conn.release();
  } catch (err) {
    logError('updateDayLong', err);
  }
}

const nx = config.reg.nx;
const ny = config.reg.ny;
const exclude = ['UUU', 'VEC', 'VVV', 'WAV'];
