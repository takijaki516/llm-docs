import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
