import moment from 'moment-timezone';

function hourMinToSec(hhmm: string) {
  const hourSec = parseInt(hhmm.substring(0, 2)) * 3600000;
  const minSec = parseInt(hhmm.substring(2, 4)) * 60000;
  return hourSec + minSec;
}

export function getDateTime(_offset: string, _interval: string, _delay: string): [date: string, time: string] {
  let ms = +moment.tz('Asia/Seoul');
  const utcOffset = moment.tz.zone('Asia/Seoul').utcOffset(ms) * 60000;
  const offset = hourMinToSec(_offset);
  const interval = hourMinToSec(_interval);
  const delay = hourMinToSec(_delay);
  ms -= utcOffset;
  ms -= offset;
  ms -= delay;
  ms -= ms % interval;
  ms += offset;
  ms += utcOffset;
  const date = moment(ms).format('YYYYMMDD');
  const time = moment(ms).format('HHmm');
  return [date, time];
}
