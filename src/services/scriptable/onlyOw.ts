import { getAll } from 'services/get/ow';
import { logError } from 'utils/logger';

export default async function getOnlyOw(lat: string, lon: string) {
  try {
    const { data, success } = await getAll(lat, lon);
    if (!success) throw new Error('ow get error');
    return { success: true, data };
  } catch (err) {
    logError('getOnlyOw', err);
    return { success: false };
  }
}
