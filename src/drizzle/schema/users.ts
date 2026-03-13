import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { relations } from "drizzle-orm"
import { usersCoursesTable } from "./usersCoursesAccess"
import { purchasesTable } from "./purchases"
import { usersLessonsCompletedTable } from "./usersLessonsCompleted"

export const userRoles = ["user", "admin"] as const
export type UserRoles = (typeof userRoles)[number]
export const userRolesEnum = pgEnum("user_roles_enum", userRoles)

export const usersTable = pgTable("users", {
  id,
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: userRolesEnum("role").notNull().default("user"),
  imageUrl: text("image_url"),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt,
  updatedAt,
})

export const usersRelationships = relations(usersTable, ({ many }) => ({
  usersCourses: many(usersCoursesTable),
  purchases: many(purchasesTable),
  usersLessonsCompleted: many(usersLessonsCompletedTable),
}))

export type Users = typeof usersTable.$inferInsert
