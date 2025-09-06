import { prisma } from './prisma';

/**
 * Gracefully disconnect from the database
 * This should be called when the application is shutting down
 */
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
}

/**
 * Check database connection health
 */
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', message: 'Database connection is working' };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get database connection info
 */
export function getDatabaseInfo() {
  return {
    connectionLimit: process.env.DATABASE_CONNECTION_LIMIT || 'Not set',
    url: process.env.DATABASE_URL ? 'Set' : 'Not set',
    directUrl: process.env.DIRECT_URL ? 'Set' : 'Not set',
  };
}
