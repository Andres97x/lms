import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { usersTable } from "./users"
import { productsTable } from "./products"
import { relations } from "drizzle-orm"

export const purchasesTable = pgTable("purchases", {
  id,
  pricePaidInCents: integer("price_paid_in_cents").notNull(),
  productDetails: jsonb("product_details")
    .notNull()
    .$type<{ name: string; description: string; imageUrl: string }>(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => productsTable.id, { onDelete: "restrict" }),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  refundedAt: timestamp("refunded_at", { withTimezone: true }),
  createdAt,
  updatedAt,
})

export const purchasesRelations = relations(purchasesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [purchasesTable.userId],
    references: [usersTable.id],
  }),
  product: one(productsTable, {
    fields: [purchasesTable.productId],
    references: [productsTable.id],
  }),
}))
