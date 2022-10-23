import config from 'config';
import { pool } from 'libs/db';
import { getDayLong } from 'services/get/kma';
import { addDay, getDateTime } from 'utils/datetime';
import { logError } from 'utils/logger';
import type { ResultSetHeader } from 'mysql2';
import type { DayLong } from 'types/db';

export default async function updateDayLong() {
  const conn = await pool.getConnection();
  try {
    const res = await getDayLong(nx, ny);
    if (!res.success) throw new Error('long get failed');
    const data: Record<string, DayLong> = {};
    const poa: Record<string, string> = {};
    const pop: Record<string, string> = {};
    const ska: Record<string, string> = {};
    const skp: Record<string, string> = {};
    const tmn: Record<string, string> = {};
    const tmx: Record<string, string> = {};
    for (const x of res.data) {
      const cate = x.category;
      if (exclude.includes(cate)) continue;
      const dt = x.fcstDate + x.fcstTime;
      if (!data[dt]) data[dt] = {};
      if (cate === 'TMN') {
        tmn[x.fcstDate] = parseInt(x.fcstValue).toString();
      } else if (cate === 'TMX') {
        tmx[x.fcstDate] = parseInt(x.fcstValue).toString();
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
    for (const [dt, e] of Object.entries(data)) {
      const date = dt.slice(0, 8);
      const time = dt.slice(8, 12);
      if (time <= '1159') {
        if (!poa[date]) poa[date] = '0';
        if (!ska[date]) ska[date] = '0';
        poa[date] = poa[date] < e.POP ? e.POP : poa[date];
        ska[date] = maxSky(ska[date], e.SKY + e.PTY);
      } else {
        if (!pop[date]) pop[date] = '0';
        if (!skp[date]) skp[date] = '0';
        pop[date] = pop[date] < e.POP ? e.POP : pop[date];
        skp[date] = maxSky(skp[date], e.SKY + e.PTY);
      }
    }
    const [dNow, tNow] = getDateTime('0000', '0001', '0000');
    const offset = tNow.slice(2, 4) < '30' ? 0 : 1;  // is ge than half minutes
    const shorts = ['-0000', '-0100', '-0200', '-0300', '-0400', '-0500', '-0600'];
    const excludeShorts = shorts.slice(offset, 6 + offset).map(t => getDateTime('0000', '0100', t)).map(([d, t]) => d + t);

    await conn.beginTransaction();
    for (const [dt, e] of Object.entries(data)) {
      if (excludeShorts.includes(dt)) continue;
      const [rows, fields] = await conn.execute<ResultSetHeader>('UPDATE `hourly` SET PCP=?, POP=?, PTY=?, REH=?, SKY=?, SNO=?, TMP=?, WSD=? WHERE dt=?', [e.PCP, e.POP, e.PTY, e.REH, e.SKY, e.SNO, e.TMP, e.WSD, dt]);
      if (rows.affectedRows === 0) {
        const [rows, fields] = await conn.execute<ResultSetHeader>('INSERT INTO `hourly` (dt, PCP, POP, PTY, REH, SKY, SNO, TMP, WSD) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [dt, e.PCP, e.POP, e.PTY, e.REH, e.SKY, e.SNO, e.TMP, e.WSD]);
      }
    }
    for (let i = 0; i < 3; i++) {
      const date = addDay(dNow, i);
      const [rows, fields] = await conn.execute<ResultSetHeader>('UPDATE `daily` SET POA=COALESCE(?, POA), POP=COALESCE(?, POP), SKA=COALESCE(?, SKA), SKP=COALESCE(?, SKP), TMN=COALESCE(?, TMN), TMX=COALESCE(?, TMX) WHERE date=?', [poa[date] ?? null, pop[date] ?? null, ska[date] ?? null, skp[date] ?? null, tmn[date] ?? null, tmx[date] ?? null, date]);
      if (rows.affectedRows === 0) {
        const [rows, fields] = await conn.execute<ResultSetHeader>('INSERT INTO `daily` VALUES (?, COALESCE(?, POA), COALESCE(?, POP), COALESCE(?, SKA), COALESCE(?, SKP), COALESCE(?, TMN), COALESCE(?, TMX))', [date, poa[date] ?? null, pop[date] ?? null, ska[date] ?? null, skp[date] ?? null, tmn[date] ?? null, tmx[date] ?? null]);
      }
    }
    await conn.commit();
    return true;
  } catch (err) {
    logError('updateDayLong', err);
    return false;
  } finally {
    conn.release();
  }
}

// 강수 형태 우선순위 매기는 함수, 순서는 내맘대로
function maxSky(prv: string, nxt: string) {
  return skyScore[prv] > skyScore[nxt] ? prv : nxt;
}

const nx = config.reg.nx;
const ny = config.reg.ny;
const exclude = ['UUU', 'VEC', 'VVV', 'WAV'];
const skyScore = {
  '10': 0,
  '30': 1,
  '40': 2,
  '35': 3,
  '45': 4,
  '37': 5,
  '47': 6,
  '36': 7,
  '46': 8,
  '34': 9,
  '44': 10,
  '31': 11,
  '41': 12,
  '33': 13,
  '43': 14,
  '32': 15,
  '42': 16,
};
