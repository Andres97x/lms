import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { createdAt, updatedAt } from "../schemaHelpers"
import { usersTable } from "./users"
import { lessonsTable } from "./lessons"
import { relations } from "drizzle-orm"

export const usersLessonsCompletedTable = pgTable(
  "users_lessons_completed",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessonsTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] })],
)

export const usersLessonsCompletedRelationships = relations(
  usersLessonsCompletedTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersLessonsCompletedTable.userId],
      references: [usersTable.id],
    }),
    lesson: one(lessonsTable, {
      fields: [usersLessonsCompletedTable.lessonId],
      references: [lessonsTable.id],
    }),
  }),
)
