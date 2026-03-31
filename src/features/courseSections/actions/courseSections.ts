"use server"

import z from "zod"
import { courseSectionSchema } from "../schemas/courseSection"
import { getCurrentUser } from "@/services/clerk"
import {
  canCreateSection,
  canDeleteSection,
  canUpdateSection,
} from "../permissions/courseSections"
import {
  deleteCourseSection,
  getNextCourseSectionOrder,
  insertCourseSection,
  updateSectionOrders as updateSectionsOrderDB,
} from "../db/courseSections"
import { revalidateCourseSectionsCache } from "../db/cache/courseSections"
import { updateCourseSection } from "../db/courseSections"

export async function createSection(
  courseId: string,
  unsafeData: z.infer<typeof courseSectionSchema>,
) {
  const { success, data } = courseSectionSchema.safeParse(unsafeData)
  const user = await getCurrentUser()

  if (!user || !success || !canCreateSection(user))
    return { error: true, message: "Failed to create section" }

  const order = await getNextCourseSectionOrder(courseId)

  const newSection = await insertCourseSection({ ...data, courseId, order })

  if (!newSection) return { error: true, message: "Failed to create section" }

  revalidateCourseSectionsCache({
    sectionId: newSection.id,
    courseId: newSection.courseId,
  })
  return {
    error: false,
    message: `Section ${newSection.name} has been created`,
  }
}

export async function updateSection(
  sectionId: string,
  unsafeData: z.infer<typeof courseSectionSchema>,
) {
  const user = await getCurrentUser()
  const { success, data } = courseSectionSchema.safeParse(unsafeData)

  if (!success || !user || !canUpdateSection(user)) {
    return { error: true, message: "Failed to update" }
  }

  const updatedSection = await updateCourseSection(sectionId, data)

  if (!updatedSection) {
    return { error: true, message: "Failed to update section" }
  }

  revalidateCourseSectionsCache({
    sectionId: updatedSection.id,
    courseId: updatedSection.courseId,
  })
  return {
    error: false,
    message: `Section ${updatedSection.name} has been updated`,
  }
}

export async function deleteSection(sectionId: string) {
  const user = await getCurrentUser()
  if (!user || !canDeleteSection(user))
    return { error: true, message: "Failed to delete" }

  const deletedSection = await deleteCourseSection(sectionId)

  if (!deletedSection) return { error: true, message: "Failed to delete" }

  revalidateCourseSectionsCache({
    sectionId: deletedSection.id,
    courseId: deletedSection.courseId,
  })

  return {
    error: false,
    message: `Section ${deletedSection.name} has been deleted`,
  }
}

export async function updateSectionsOrder(sectionIds: string[]) {
  const user = await getCurrentUser()

  if (sectionIds.length === 0 || !canUpdateSection(user))
    return { error: true, message: "Failed to update sections order" }

  const updatedSections = await updateSectionsOrderDB(sectionIds)

  updatedSections.flat().forEach((section) => {
    revalidateCourseSectionsCache({
      sectionId: section.id,
      courseId: section.courseId,
    })
  })

  return { error: false, message: "Successfully reordered your sections" }
}
