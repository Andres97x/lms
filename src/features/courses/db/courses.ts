import { db } from "@/drizzle/db"
import { Courses, coursesTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export async function insertCourse(values: Courses) {
  const [newCourse] = await db.insert(coursesTable).values(values).returning()

  return newCourse
}

export async function deleteCourse(id: string) {
  const [deletedCourse] = await db
    .delete(coursesTable)
    .where(eq(coursesTable.id, id))
    .returning()

  return deletedCourse
}

export async function updateCourse(id: string, values: Partial<Courses>) {
  const [updatedCourse] = await db
    .update(coursesTable)
    .set(values)
    .where(eq(coursesTable.id, id))
    .returning()

  return updatedCourse
}
