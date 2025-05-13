import { User } from '../user/user.model';

const totalStatistics = async () => {
  const [recentUser, totalUser] = await Promise.all([
    User.countDocuments({ role: 'USER' }).sort({ createdAt: -1 }).limit(5),
    User.countDocuments({ role: 'USER' }),
  ]);
  return Promise.all([recentUser, totalUser]).then(
    ([recentUser, totalUser]) => [{ recentUser, totalUser }],
  );
};

export const dashboardService = {
  totalStatistics,
};
