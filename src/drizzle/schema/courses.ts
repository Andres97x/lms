import { relations } from "drizzle-orm"
import { pgTable, text } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { coursesProductsTable } from "./coursesProducts"
import { courseSectionsTable } from "./courseSections"
import { usersCoursesTable } from "./usersCoursesAccess"

export const coursesTable = pgTable("courses", {
  id,
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt,
  updatedAt,
})

export const coursesRelationships = relations(coursesTable, ({ many }) => ({
  coursesProducts: many(coursesProductsTable),
  courseSections: many(courseSectionsTable),
  usersCourses: many(usersCoursesTable),
}))
