import { getCourseTag, getGlobalTag, getIdTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getLessonsGlobalTag() {
  return getGlobalTag("lessons")
}

export function getLessonsIdTag(lessonId: string) {
  return getIdTag("lessons", lessonId)
}

export function getLessonsCourseTag(courseId: string) {
  return getCourseTag("lessons", courseId)
}

export function revalidateLessonsCache({
  lessonId,
  courseId,
}: {
  lessonId: string
  courseId: string
}) {
  revalidateTag(getLessonsGlobalTag(), { expire: 0 })
  revalidateTag(getLessonsIdTag(lessonId), { expire: 0 })
  revalidateTag(getLessonsCourseTag(courseId), { expire: 0 })
}
