import { IJournal } from './journal.interface';
import { Journal } from './journal.model';

const createJournal = async (data: IJournal) => {
  const date = new Date();

  const value = {
    ...data,
    date: date,
  };

  const result = await Journal.create(value);
  return result;
};

export const JournalService = {
  createJournal,
};
