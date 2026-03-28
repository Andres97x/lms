import { getGlobalTag, getIdTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getCoursesGlobalTag() {
  return getGlobalTag("courses")
}

export function getCourseIdTag(id: string) {
  return getIdTag("courses", id)
}

export function revalidateCoursesCache(courseId: string) {
  revalidateTag(getCoursesGlobalTag(), { expire: 0 })
  revalidateTag(getCourseIdTag(courseId), { expire: 0 })
}
