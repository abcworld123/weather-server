function hourMinToSec(hhmm: string) {
  const isNeg = hhmm[0] === '-' ? 1 : 0;
  const hourSec = parseInt(hhmm.slice(0, 2 + isNeg)) * 3600000;
  const minSec = parseInt(hhmm.slice(2 + isNeg, hhmm.length)) * 60000;
  return hourSec + minSec;
}

export function getDateTime(_offset: string, _interval: string, _delay: string): [date: string, time: string] {
  let ms = Date.now();
  const utcOffset = 32400000;
  const offset = hourMinToSec(_offset);
  const interval = hourMinToSec(_interval);
  const delay = hourMinToSec(_delay);
  ms += utcOffset;
  ms -= offset;
  ms -= delay;
  ms -= ms % interval;
  ms += offset;
  // ms -= utcOffset;
  const datetime = new Date(ms).toISOString().replace(/[T\-:]|\..+/g, '').slice(0, 12);
  const date = datetime.slice(0, 8);
  const time = datetime.slice(8, 12);
  return [date, time];
}

export function addDay(_date: string, amount: number) {
  const dayMs = 86400000;
  const _year = _date.slice(0, 4);
  const _month = _date.slice(4, 6);
  const _day = _date.slice(6, 8);
  _date = `${_year}-${_month}-${_day}`;
  const date = new Date(new Date(_date).getTime() + (dayMs * amount)).toISOString().replaceAll('-', '').slice(0, 8);
  return date;
}

export function getLogDateTime() {
  const utcOffset = 32400000;
  const ms = Date.now() + utcOffset;
  const dt = new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
  return dt;
}
