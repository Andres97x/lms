import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { coursesTable } from "@/drizzle/schema/courses"
import { productsTable } from "@/drizzle/schema/products"
import { createdAt, updatedAt } from "../schemaHelpers"
import { relations } from "drizzle-orm"

export const coursesProductsTable = pgTable(
  "courses_products",
  {
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "restrict" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => productsTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.courseId, table.productId] })],
)

export const coursesProductsRelationships = relations(
  coursesProductsTable,
  ({ one }) => ({
    course: one(coursesTable, {
      fields: [coursesProductsTable.courseId],
      references: [coursesTable.id],
    }),
    product: one(productsTable, {
      fields: [coursesProductsTable.productId],
      references: [productsTable.id],
    }),
  }),
)
