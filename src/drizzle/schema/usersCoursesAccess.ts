import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { usersTable } from "./users"
import { coursesTable } from "./courses"
import { createdAt, updatedAt } from "../schemaHelpers"
import { relations } from "drizzle-orm"

export const usersCoursesTable = pgTable(
  "users_courses",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.userId, table.courseId] })],
)

export const usersCoursesRelationships = relations(
  usersCoursesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersCoursesTable.userId],
      references: [usersTable.id],
    }),
    course: one(coursesTable, {
      fields: [usersCoursesTable.courseId],
      references: [coursesTable.id],
    }),
  }),
)
