import config from 'config';
import { pool } from 'libs/db';
import { getDateTime } from 'utils/datetime';
import { logError } from 'utils/logger';
import type { ResultSetHeader } from 'mysql2';
import type { Hourly } from 'types/db';

export default async function moveNowToShort() {
  const conn = await pool.getConnection();
  try {
    const { dt: dtPrv } = getDateTime('0000', '0100', '0100');
    const { dt: dtNow } = getDateTime('0000', '0100', '0000');
    await conn.beginTransaction();
    const [rowsP, fieldsP] = await conn.execute<Hourly[]>('SELECT * FROM `hourly` WHERE dt=?', [dtPrv]);
    if (rowsP.length) {
      const { PCP, PTY, REH, TMP, WSD } = rowsP[0];
      const [rowsN, fieldsN] = await conn.execute<ResultSetHeader>('UPDATE `hourly` SET PCP=?, PTY=?, REH=?, TMP=?, WSD=? WHERE dt=?', [PCP, PTY, REH, TMP, WSD, dtNow]);
    }
    await conn.commit();
    return true;
  } catch (err) {
    logError('moveNowToShort', err);
    return false;
  } finally {
    conn.release();
  }
}
