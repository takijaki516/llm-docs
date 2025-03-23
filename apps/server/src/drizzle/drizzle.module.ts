import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

export const DRIZZLE = Symbol('drizzle-client');
export type DRIZZLE_CLIENT = NodePgDatabase;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: false,
        });

        return drizzle(pool);
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
