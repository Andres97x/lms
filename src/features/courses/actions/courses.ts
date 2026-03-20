"use server"

import z from "zod"
import { courseSchema } from "../schemas/courses"
import { getCurrentUser } from "@/services/clerk"
import { redirect } from "next/navigation"
import { canCreateCourse, canDeleteCourse } from "../permissions/courses"
import { insertCourse } from "../db/courses"
import { revalidateCoursesCache } from "../db/cache"
import { deleteCourse as deleteDBCourse } from "../db/courses"
import { revalidatePath } from "next/cache"

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
  let courseId

  const { success, data } = courseSchema.safeParse(unsafeData)
  const user = await getCurrentUser()

  if (!success || !user || !canCreateCourse(user)) {
    return { error: true, message: "There was a problem creating the course" }
  }

  try {
    const course = await insertCourse(data)
    if (!course) {
      return { error: true, message: "There was a problem creating the course" }
    }

    revalidateCoursesCache(course.id)
    courseId = course.id
    // return { success: true, course }
  } catch (err) {
    console.log(err)

    return {
      error: true,
      message: "Server Error",
    }
  }
  redirect(`/admin/courses/${courseId}/edit`)
}

export async function deleteCourse(id: string) {
  const user = await getCurrentUser()
  if (!user || !canDeleteCourse(user)) {
    return { error: true, message: "There was an error deleting the course" }
  }

  const deletedCourse = await deleteDBCourse(id)

  if (!deletedCourse) {
    return { error: true, message: "There was an error deleting the course" }
  }

  revalidateCoursesCache(id)
  return {
    success: true,
    message: `Course ${deletedCourse.name} has been deleted`,
  }
}
