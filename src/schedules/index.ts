import schedule, { scheduleJob } from 'node-schedule';
import updateDayLong from 'schedules/updateDayLong';
import updateDayNow from 'schedules/updateDayNow';
import updateDayShort from 'schedules/updateDayShort';
import updateWeek from 'schedules/updateWeek';

export default function runScheduleJobs() {
  const ruleDayShortNow = new schedule.RecurrenceRule();
  const ruleDayLong = new schedule.RecurrenceRule();
  const ruleWeek = new schedule.RecurrenceRule();
  ruleDayShortNow.minute = [0, 10, 20, 30, 40, 50];
  ruleDayLong.hour = [2, 5, 8, 11, 14, 17, 20, 23];
  ruleWeek.hour = [6, 18];

  scheduleJob(ruleDayShortNow, runDayShortNow);
  scheduleJob(ruleDayLong, runDayLong);
  scheduleJob(ruleWeek, runWeek);
}

async function runDayShortNow() {
  try {
    await updateDayShort();
    await updateDayNow();
    logInfo('runDayShortNow', 'success');
  } catch (err) {
    logError('runDayShortNow', err.message);

  }
}

async function runDayLong() {
  try {
    await updateDayLong();
    logInfo('runDayLong', 'success');
  } catch (err) {
    logError('runDayLong', err.message);

  }
}

async function runWeek() {
  try {
    await updateWeek();
    logInfo('runWeek', 'success');
  } catch (err) {
    logError('runWeek', err.message);

  }
}

function logInfo(title: string, msg: string) {
  const dt = new Date().toISOString();
  console.info(`\x1B[32m[INFO] [${dt}] ${title}: ${msg}\x1B[0m`);
}

function logError(title: string, msg: string) {
  const dt = new Date().toISOString();
  console.error(`\x1B[31m[ERROR] [${dt}] ${title}: ${msg}\x1B[0m`);

}
