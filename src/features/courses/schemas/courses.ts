import z, { string } from "zod"

export const courseSchema = z.object({
  name: string().min(1, "Name is required"),
  description: string().min(1, "Description is required"),
})
