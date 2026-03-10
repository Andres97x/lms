import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { courseSectionsTable } from "./courseSections"
import { relations } from "drizzle-orm"
import { usersLessonsCompletedTable } from "./usersLessonsCompleted"

export const lessonStatuses = ["private", "public", "preview"] as const
export type LessonStatus = (typeof lessonStatuses)[number]
export const lessonStatusEnum = pgEnum("lesson_status", lessonStatuses)

export const lessonsTable = pgTable("lessons", {
  id,
  name: text("name").notNull(),
  description: text(),
  videoId: text().notNull(),
  order: integer("order").notNull(),
  status: lessonStatusEnum("status").notNull().default("private"),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => courseSectionsTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
})

export const lessonsRelationships = relations(
  lessonsTable,
  ({ one, many }) => ({
    section: one(courseSectionsTable, {
      fields: [lessonsTable.sectionId],
      references: [courseSectionsTable.id],
    }),
    usersLessonsCompleted: many(usersLessonsCompletedTable),
  }),
)
