import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersSchema = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  refreshToken: text('refresh_token').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
