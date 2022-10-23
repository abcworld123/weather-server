import { scheduleJob } from 'node-schedule';
import updateDayLong from 'schedules/updateDayLong';
import updateDayNow from 'schedules/updateDayNow';
import updateDayShort from 'schedules/updateDayShort';
import updateWeek from 'schedules/updateWeek';
import { getDayVer } from 'services/get/kma';
import { getDateTime, getLogDateTime } from 'utils/datetime';

let verNow = '';
let verShort = '';
let verLong = '';

export default function runScheduleJobs() {
  scheduleJob('1 */1 * * * *', runDay);
  scheduleJob('1 0 */6 * * *', runWeek);
}

async function runDay() {
  const { dt: dtNow } = getDateTime('0000', '0100', '0030');
  getDayVer(dtNow, 'ODAM').then(async (ver) => {
    if (ver !== verNow) {
      if (ver === null) {
        logError('runDayNow', 'ver check failed');
        return;
      }
      verNow = ver;
      const success = await updateDayNow();
      if (success) logInfo('runDayNow', 'success');
      else logError('runDayNow', 'update failed');
    }
  });

  const { dt: dtShort } = getDateTime('0030', '0100', '0000');
  getDayVer(dtShort, 'VSRT').then(async (ver) => {
    if (ver !== verShort) {
      if (ver === null) {
        logError('runDayShort', 'ver check failed');
        return;
      }
      verShort = ver;
      const success = await updateDayShort();
      if (success) logInfo('runDayShort', 'success');
      else logError('runDayShort', 'failed');
    }
  });

  const { dt: dtLong } = getDateTime('0200', '0300', '0000');
  getDayVer(dtLong, 'SHRT').then(async (ver) => {
    if (ver !== verLong) {
      if (ver === null) {
        logError('runDayLong', 'ver check failed');
        return;
      }
      verLong = ver;
      const success = await updateDayLong();
      if (success) logInfo('runDayLong', 'success');
      else logError('runDayLong', 'failed');
    }
  });
}

async function runWeek() {
  const success = await updateWeek();
  if (success) logInfo('runWeek', 'success');
  else logError('runWeek', 'failed');
}

function logInfo(title: string, msg: string) {
  const dt = getLogDateTime();
  console.info(`\x1B[32m[INFO] [${dt}] ${title}: ${msg}\x1B[0m`);
}

function logError(title: string, msg: string) {
  const dt = getLogDateTime();
  console.error(`\x1B[31m[ERROR] [${dt}] ${title}: ${msg}\x1B[0m`);
}
