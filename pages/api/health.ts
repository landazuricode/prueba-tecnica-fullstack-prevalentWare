import { NextApiRequest, NextApiResponse } from 'next';
import { checkDatabaseHealth, getDatabaseInfo } from '@/lib/db-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dbHealth = await checkDatabaseHealth();
    const dbInfo = getDatabaseInfo();

    const healthStatus = {
      status: dbHealth.status,
      timestamp: new Date().toISOString(),
      database: {
        health: dbHealth,
        info: dbInfo,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        betterAuthUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_URL
          ? 'Set'
          : 'Not set',
        githubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
          ? 'Set'
          : 'Not set',
      },
    };

    const statusCode = dbHealth.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
