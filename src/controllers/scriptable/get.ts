import config from 'config';
import { getRegionName } from 'services/get/kakao';
import { getOnlyOw, getWithOw } from 'services/scriptable';
import toXY from 'utils/toXY';
import type { ReqScriptableGet, ResWithOwGet } from 'types/apis';

export default async function controller(req: Request<ReqScriptableGet>, res: Response<ResWithOwGet>, next: NextFunction) {
  const { lat, lon, withOw } = req.query;
  const { nx, ny } = toXY(lat, lon);
  let data: ResWithOwGet;

  if (nx === homeNx && ny === homeNy) {
    if (withOw) {
      data = await getWithOw(lat, lon);
    } else {
      data = await getWithOw(lat, lon);  // todo getOnlyKma
    }
    data.data.region = homeRegName;
  } else {
    data = await getOnlyOw(lat, lon);
    data.data.region = await getRegionName(lat, lon);
  }
  res.json(data);
}

const homeNx = parseInt(config.reg.nx);
const homeNy = parseInt(config.reg.ny);
const homeRegName = config.reg.homeRegName;
