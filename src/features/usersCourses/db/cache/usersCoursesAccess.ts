import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getUsersCoursesAccessGlobalTag() {
  return getGlobalTag("usersCoursesAccess")
}

export function getUsersCoursesAccessIdTag({
  userId,
  courseId,
}: {
  userId: string
  courseId: string
}) {
  return getIdTag("usersCoursesAccess", `course:${courseId}-user:${userId}`)
}

export function getUsersCoursesAccessUserTag(userId: string) {
  return getUserTag("usersCoursesAccess", userId)
}

export function revalidateUserCoursesAccessCache({
  userId,
  courseId,
}: {
  userId: string
  courseId: string
}) {
  revalidateTag(getUsersCoursesAccessGlobalTag(), { expire: 0 })
  revalidateTag(getUsersCoursesAccessIdTag({ userId, courseId }), { expire: 0 })
  revalidateTag(getUsersCoursesAccessUserTag(userId), { expire: 0 })
}
