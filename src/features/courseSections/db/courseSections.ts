import { db } from "@/drizzle/db"
import { CourseSections, courseSectionsTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export async function getNextCourseSectionOrder(courseId: string) {
  const section = await db.query.courseSectionsTable.findFirst({
    columns: { order: true },
    where: ({ courseId: courseIdCol }, { eq }) => eq(courseIdCol, courseId),
    orderBy: ({ order }, { desc }) => desc(order),
  })

  return section ? section.order + 1 : 0
}

export async function insertCourseSection(data: CourseSections) {
  const [newSection] = await db
    .insert(courseSectionsTable)
    .values(data)
    .returning()

  return newSection
}

export async function updateCourseSection(
  sectionId: string,
  data: Partial<CourseSections>,
) {
  const [updatedSection] = await db
    .update(courseSectionsTable)
    .set(data)
    .where(eq(courseSectionsTable.id, sectionId))
    .returning()

  return updatedSection
}

export async function deleteCourseSection(sectionId: string) {
  const [deletedCourse] = await db
    .delete(courseSectionsTable)
    .where(eq(courseSectionsTable.id, sectionId))
    .returning()

  return deletedCourse
}

export async function updateSectionOrders(sectionIds: string[]) {
  const sections = await Promise.all(
    sectionIds.map((id, index) =>
      db
        .update(courseSectionsTable)
        .set({ order: index })
        .where(eq(courseSectionsTable.id, id))
        .returning({
          id: courseSectionsTable.id,
          courseId: courseSectionsTable.courseId,
        }),
    ),
  )

  return sections
}
