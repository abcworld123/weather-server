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

  scheduleJob(ruleDayShortNow, updateDayShortNow);
  scheduleJob(ruleDayLong, updateDayLong);
  scheduleJob(ruleWeek, updateWeek);
}

async function updateDayShortNow() {
  await updateDayShort();
  await updateDayNow();
}
