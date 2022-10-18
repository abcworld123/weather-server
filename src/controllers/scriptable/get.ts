import { getWithOw } from 'services/scriptable/withOw';
import type { ReqScriptableGet, ResWithOwGet } from 'types/apis';

export default async function controller(req: Request<ReqScriptableGet>, res: Response<ResWithOwGet>, next: NextFunction) {
  let data: ResWithOwGet;
  if (req.query.withOw) {
    data = await getWithOw();
  } else {
    data = await getWithOw();  // todo getOnlyKma
  }
  res.json(data);
}
