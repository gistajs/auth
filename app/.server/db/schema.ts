import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import {
  defaultHex,
  defaultNow,
  id,
  idx,
  timestamp,
} from './helpers/primitives'

export const users = sqliteTable(
  'users',
  {
    id: id(),
    public_id: defaultHex(),
    email: text().unique().notNull(),
    name: text(),
    created_at: defaultNow(),
    updated_at: defaultNow(),
    verified_at: timestamp(),
    token: defaultHex(24),
    token_expires_at: timestamp(),
    password: text(),
    meta: text({ mode: 'json' }).$type<UserMeta>(),
  },
  (t) => [idx(t, 'created_at'), idx(t, 'updated_at')],
)

export const userInsertSchema = createInsertSchema(users, {
  email: (z) => z.trim().toLowerCase(),
  password: (z) =>
    z
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters'),
})

export const userUpdateSchema = createUpdateSchema(users, {
  email: (z) => z.trim().toLowerCase(),
  password: (z) =>
    z
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters'),
})

export type Select = typeof users.$inferSelect
export type Insert = typeof users.$inferInsert
export type Update = Partial<Insert>

export type UserMeta = {
  auth: {
    google?: { id: string; image_url: string }
    github?: { id: number; image_url: string; login: string }
  }
}
