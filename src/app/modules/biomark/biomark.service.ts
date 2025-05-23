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

const createBiamarkExtra = async (data: Record<string, any> | IBiomark) => {
  data.upload = true;

  const result = await Biomark.create(data as IBiomark);
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

const getUpdatedBiomarks = async (userId: string) => {
  const latestEntry: any = await Biomark.findOne({ userId })
    .sort({ updatedAt: -1 })
    .select('updatedAt');

  if (!latestEntry) return [];

  const latestDate = new Date(latestEntry.updatedAt);

  latestDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(latestDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const result = await Biomark.find({
    userId,
    updatedAt: { $gte: latestDate, $lt: nextDay },
  });

  return result;
};

export const BiomarkService = {
  createBiamark,
  getPendingBiomarks,
  uploadBiomarks,
  getUpdatedBiomarks,
  createBiamarkExtra,
};
