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

const getPendingBiomarks = async (userId: string) => {
  const result = await Biomark.find({ userId, upload: false });
  return result;
};

const uploadBiomarks = async (selectedIds: string[]) => {
  const result = await Biomark.updateMany(
    { _id: { $in: selectedIds } },
    { $set: { upload: true } },
  );
  return result;
};

export const BiomarkService = {
  createBiamark,
  getPendingBiomarks,
  uploadBiomarks,
};
