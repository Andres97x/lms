import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { relations } from "drizzle-orm"
import { coursesProductsTable } from "./coursesProducts"
import { purchasesTable } from "./purchases"

export const productStatuses = ["public", "private"] as const
export type ProductStatus = (typeof productStatuses)[number]
export const productStatusEnum = pgEnum("product_status", productStatuses)

export const productsTable = pgTable("products", {
  id,
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  priceInDollar: integer("price_in_dollar").notNull(),
  status: productStatusEnum("status").notNull().default("private"),
  createdAt,
  updatedAt,
})

export const productsRelationships = relations(productsTable, ({ many }) => ({
  coursesProducts: many(coursesProductsTable),
  purchases: many(purchasesTable),
}))
