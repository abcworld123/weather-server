import type { RowDataPacket } from 'mysql2';

export interface Hourly extends RowDataPacket {
  dt: string;
  LGT: string;
  PCP: string;
  POP: string;
  PTY: string;
  REH: string;
  SKY: string;
  SNO: string;
  TMP: string;
  WSD: string;
}

export interface Daily extends RowDataPacket {
  date: string;
  POA: string;
  POP: string;
  SKA: string;
  SKP: string;
  TMN: string;
  TMX: string;
}

export interface DayNow {
  PTY?: string;
  REH?: string;
  RN1?: string;
  T1H?: string;
  WSD?: string;
}

export interface DayShort {
  LGT?: string;
  PTY?: string;
  REH?: string;
  RN1?: string;
  SKY?: string;
  T1H?: string;
  WSD?: string;
}

export interface DayLong {
  PCP?: string;
  POP?: string;
  PTY?: string;
  REH?: string;
  SKY?: string;
  SNO?: string;
  TMP?: string;
  WSD?: string;
}
