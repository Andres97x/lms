import { getCourseTag, getGlobalTag, getIdTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getCourseSectionsGlobalTag() {
  return getGlobalTag("courseSections")
}

export function getCourseSectionsIdTag(sectionId: string) {
  return getIdTag("courseSections", sectionId)
}

export function getCourseSectionsCourseTag(courseId: string) {
  return getCourseTag("courseSections", courseId)
}

export function revalidateCourseSectionsCache({
  sectionId,
  courseId,
}: {
  sectionId: string
  courseId: string
}) {
  revalidateTag(getCourseSectionsGlobalTag(), { expire: 0 })
  revalidateTag(getCourseSectionsIdTag(sectionId), { expire: 0 })
  revalidateTag(getCourseSectionsCourseTag(courseId), { expire: 0 })
}
