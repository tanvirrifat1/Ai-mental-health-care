import { IBiomark } from './biomark.interface';
import { Biomark } from './biomark.model';

const createBiamark = async (data: Record<string, any> | IBiomark) => {
  let biomarksToInsert: IBiomark[] = [];

  if ('testName' in data && 'description' in data) {
    biomarksToInsert = [data as IBiomark];
  } else {
    const userId = (data as any).userId;

    biomarksToInsert = Object.keys(data)
      .filter(key => !isNaN(Number(key)))
      .map(key => ({
        ...data[key],
        ...(userId && { userId }),
      }));
  }

  const result = await Biomark.insertMany(biomarksToInsert);
  return result;
};

export const BiomarkService = {
  createBiamark,
};
