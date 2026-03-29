import { courseSectionsStatuses } from "@/drizzle/schema"
import z from "zod"

export const courseSectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(courseSectionsStatuses),
})
