import { ISetting } from './setting.interface';
import { Setting } from './setting.model';

const createFromDb = async (data: ISetting) => {
  const isExistData = await Setting.findOne({ type: data.type });

  let result;

  if (isExistData) {
    result = await Setting.findOneAndUpdate(
      { type: data.type },
      { $set: { description: data.description, title: data.title } },
      { new: true },
    );
  } else {
    result = await Setting.create(data);
  }

  return result;
};

const getFromDb = async (type: string) => {
  const result = await Setting.findOne({ type });
  return result;
};

export const SettingService = {
  createFromDb,
  getFromDb,
};
