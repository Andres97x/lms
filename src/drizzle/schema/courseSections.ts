import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { coursesTable } from "./courses"
import { relations } from "drizzle-orm"
import { lessonsTable } from "./lessons"

export const courseSectionsStatuses = ["public", "private"] as const
export type CourseSectionsStatus = (typeof courseSectionsStatuses)[number]
export const courseSectionsStatusEnum = pgEnum(
  "course_sections_enum",
  courseSectionsStatuses,
)

export const courseSectionsTable = pgTable("course_sections", {
  id,
  name: text("name").notNull(),
  status: courseSectionsStatusEnum("status").notNull().default("private"),
  order: integer("order").notNull(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => coursesTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
})

export const courseSectionsRelationships = relations(
  courseSectionsTable,
  ({ one, many }) => ({
    course: one(coursesTable, {
      fields: [courseSectionsTable.courseId],
      references: [coursesTable.id],
    }),
    lessons: many(lessonsTable),
  }),
)

export type CourseSections = typeof courseSectionsTable.$inferInsert
