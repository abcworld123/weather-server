import config from 'config';
import { getNotHome, getHome } from 'services/scriptable';
import toXY from 'utils/toXY';
import type { ReqScriptableGet, ResWithOwGet } from 'types/apis';

export default async function controller(req: Request<ReqScriptableGet>, res: Response<ResWithOwGet>, next: NextFunction) {
  const { lat, lon } = req.query;
  const { nx, ny } = toXY(lat, lon);
  let data: ResWithOwGet;

  if (nx === homeNx && ny === homeNy) {
    data = await getHome(lat, lon);
  } else {
    data = await getNotHome(lat, lon);
  }
  res.json(data);
}

const homeNx = parseInt(config.reg.nx);
const homeNy = parseInt(config.reg.ny);
