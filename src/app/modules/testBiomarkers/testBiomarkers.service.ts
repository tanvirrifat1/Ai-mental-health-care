import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Biomark } from '../biomark/biomark.model';
import { ITestBiomarkers } from './testBiomarkers.interface';
import { TestBiomarkers } from './testBiomarkers.model';
import { sendEmail } from '../../../helpers/sendMail';
import { isSameDay } from 'date-fns';
import { User } from '../user/user.model';
import { MsiBpdTest } from '../msiTest/msiTest.model';
import { MdqTest } from '../mdqTest/mdqTest.model';
import { Gad7Test } from '../gad7Test/gad7Test.model';
import { Dass21 } from '../dass21/dass21.model';
import { Bprs } from '../bprs/bprs.model';
import { AceTest } from '../aceTest/aceTest.model';

const createTestBiomarkers = async (data: ITestBiomarkers) => {
  const biomarkerExists = await Biomark.exists({ _id: data.biomarkerId });
  if (!biomarkerExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Biomarker not found');
  }

  const createdTest = await TestBiomarkers.create(data);

  await Biomark.updateOne(
    { _id: data.biomarkerId },
    { $set: { isSend: true } },
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
    select: 'testName ',
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

const getDetails = async (biomarkerId: string) => {
  const result = await TestBiomarkers.findOne({ biomarkerId }).populate({
    path: 'biomarkerId',
    select: 'testName -_id',
  });
  return result;
};

const getAllTestHistory = async (query: Record<string, unknown>) => {
  const { page = '1', limit = '10', searchTerm, ...filterData } = query;
  const pages = parseInt(page as string);
  const size = parseInt(limit as string);
  const skip = (pages - 1) * size;

  const testModels = [
    { name: 'MsiBpdTest', model: MsiBpdTest },
    { name: 'MdqTest', model: MdqTest },
    { name: 'Gad7Test', model: Gad7Test },
    { name: 'Dass21', model: Dass21 },
    { name: 'Bprs', model: Bprs },
    { name: 'AceTest', model: AceTest },
  ];

  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      type: { $regex: searchTerm, $options: 'i' },
    });
  }

  if (Object.keys(filterData).length) {
    conditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Run all test model queries in parallel
  const allResults = (
    await Promise.all(
      testModels.map(async ({ name, model }) => {
        const docs = await model
          // @ts-ignore
          .find(whereConditions)
          .sort({ createdAt: -1 })
          .lean();
        return docs.map((doc: any) => ({ ...doc, testType: name }));
      }),
    )
  ).flat();

  // Sort and paginate
  const sortedResults = allResults.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const paginatedResults = sortedResults.slice(skip, skip + size);

  return {
    result: paginatedResults,
    meta: {
      page: pages,
      limit: size,
      total: allResults.length,
    },
  };
};

export const TestBiomarkersService = {
  createTestBiomarkers,
  getMyTestBiomarkers,
  sendAutoMail,
  getDetails,
  getAllTestHistory,
};
