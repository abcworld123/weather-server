import { getWithOw } from 'services/scriptable/withOw';
import type { ReqScriptableGet, ResWithOwGet } from 'types/apis';

export default async function controller(req: Request<ReqScriptableGet>, res: Response<ResWithOwGet>, next: NextFunction) {
  const { lat, lon, withOw } = req.query;
  let data: ResWithOwGet;
  if (withOw) {
    data = await getWithOw(lat, lon);
  } else {
    data = await getWithOw(lat, lon);  // todo getOnlyKma
  }
  res.json(data);
}
