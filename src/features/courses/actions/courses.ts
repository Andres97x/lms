"use server"

import z from "zod"
import { courseSchema } from "../schemas/courses"
import { getCurrentUser } from "@/services/clerk"
import { redirect } from "next/navigation"
import {
  canCreateCourse,
  canDeleteCourse,
  canUpdateCourse,
} from "../permissions/courses"
import { insertCourse } from "../db/courses"
import { revalidateCoursesCache } from "../db/cache/courses"
import {
  deleteCourse as deleteDBCourse,
  updateCourse as updateCourseDB,
} from "../db/courses"

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
    // return { error: false, course }
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
    error: false,
    message: `Course ${deletedCourse.name} has been deleted`,
  }
}

export async function updateCourse(
  id: string,
  unsafeData: z.infer<typeof courseSchema>,
) {
  const user = await getCurrentUser()
  const { success, data } = courseSchema.safeParse(unsafeData)
  if (!success || !user || !canUpdateCourse(user))
    return {
      error: true,
      message: "There was an error updating the course",
    }

  const updatedCourse = await updateCourseDB(id, data)

  if (!updatedCourse)
    return {
      error: true,
      message: "There was an error updating the course",
    }

  revalidateCoursesCache(updatedCourse.id)
  return {
    error: false,
    message: `Course ${updatedCourse.name} has been updated`,
  }
}
