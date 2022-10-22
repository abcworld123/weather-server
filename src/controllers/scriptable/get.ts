import config from 'config';
import { getOnlyOw, getWithOw } from 'services/scriptable';
import toXY from 'utils/toXY';
import type { ReqScriptableGet, ResWithOwGet } from 'types/apis';

export default async function controller(req: Request<ReqScriptableGet>, res: Response<ResWithOwGet>, next: NextFunction) {
  const { lat, lon, withOw } = req.query;
  const { nx, ny } = toXY(lat, lon);
  let data: ResWithOwGet;

  if (nx === houseNx && ny === houseNy) {
    if (withOw) {
      data = await getWithOw(lat, lon);
    } else {
      data = await getWithOw(lat, lon);  // todo getOnlyKma
    }
  } else {
    data = await getOnlyOw(lat, lon);
  }
  res.json(data);
}

const houseNx = parseInt(config.reg.nx);
const houseNy = parseInt(config.reg.ny);
