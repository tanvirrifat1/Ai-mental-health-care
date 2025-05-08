import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Biomark } from '../biomark/biomark.model';
import { ITestBiomarkers } from './testBiomarkers.interface';
import { TestBiomarkers } from './testBiomarkers.model';
import { sendEmail } from '../../../helpers/sendMail';
import { isSameDay } from 'date-fns';
import { User } from '../user/user.model';

const createTestBiomarkers = async (data: ITestBiomarkers) => {
  const biomarkerExists = await Biomark.exists({ _id: data.biomarkerId });
  if (!biomarkerExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Biomarker not found');
  }

  const createdTest = await TestBiomarkers.create(data);

  await Biomark.updateOne(
    { _id: data.biomarkerId },
    { $set: { isTest: true } },
  );

  return createdTest;
};

const getMyTestBiomarkers = async (userId: string) => {
  const latestEntry: any = await TestBiomarkers.findOne({ userId })
    .sort({ updatedAt: -1 })
    .select('updatedAt');

  if (!latestEntry) return [];

  const latestDate = new Date(latestEntry.updatedAt);

  latestDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(latestDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const result = await TestBiomarkers.find({
    userId,
    updatedAt: { $gte: latestDate, $lt: nextDay },
  }).populate({
    path: 'biomarkerId',
    select: 'testName -_id',
  });

  return result;
};

const sendAutoMail = async () => {
  const now = new Date();

  const results = await TestBiomarkers.find({
    testingReminder: { $lte: now },
    isSend: false,
  });

  if (!results.length) return 'No pending emails to send.';

  const biomarkerIds = results.map(r => r.biomarkerId.toString());
  const userIds = results.map(r => r.userId.toString());

  const [biomarkers, users] = await Promise.all([
    Biomark.find({ _id: { $in: biomarkerIds } }),
    User.find({ _id: { $in: userIds } }),
  ]);

  const biomarkerMap = new Map(
    biomarkers.map(b => [b._id.toString(), b.testName]),
  );
  const userMap = new Map(users.map(u => [u._id.toString(), u.email]));

  const bulkOps: any[] = [];

  await Promise.all(
    results.map(async test => {
      const userEmail = userMap.get(test.userId.toString());
      const testName = biomarkerMap.get(test.biomarkerId.toString());

      if (userEmail && testName) {
        try {
          await sendEmail(
            userEmail,
            'Your test reminder',
            `<div style="text-align: center;">
              <strong>Please test ${testName} today.</strong>
            </div>`,
          );

          bulkOps.push({
            updateOne: {
              filter: { _id: test._id },
              update: { $set: { isSend: true } },
            },
          });
        } catch (error) {
          console.error(`Failed to send email to ${userEmail}:`, error);
        }
      }
    }),
  );

  if (bulkOps.length) {
    await TestBiomarkers.bulkWrite(bulkOps);
  }

  return 'Emails processed successfully';
};

export const TestBiomarkersService = {
  createTestBiomarkers,
  getMyTestBiomarkers,
  sendAutoMail,
};
