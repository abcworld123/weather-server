import config from 'config';
import { getRegionName } from 'services/get/kakao';
import { getNotHome, getHome } from 'services/scriptable';
import toXY from 'utils/toXY';
import type { ReqScriptableGet, ResWithOwGet } from 'types/apis';

export default async function controller(req: Request<ReqScriptableGet>, res: Response<ResWithOwGet>, next: NextFunction) {
  const { lat, lon } = req.query;
  const { nx, ny } = toXY(lat, lon);
  const region = await getRegionName(lat, lon);
  let data: ResWithOwGet;

  if (nx === homeNx && ny === homeNy) {
    data = await getHome(lat, lon, region);
  } else {
    data = await getNotHome(lat, lon, region);
  }
  res.json(data);
}

const homeNx = parseInt(config.reg.nx);
const homeNy = parseInt(config.reg.ny);
