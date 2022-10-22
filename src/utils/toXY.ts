export default function toXY(lat: string, lon: string) {
  const DEGRAD = Math.PI / 180.0;
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  let ra = Math.tan(Math.PI * 0.25 + parseFloat(lat) * DEGRAD * 0.5);
  let theta = parseFloat(lon) * DEGRAD - olon;
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  sf = sf ** sn * Math.cos(slat1) / sn;
  ro = re * sf / ro ** sn;
  ra = re * sf / ra ** sn;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}
