type CACHE_TAG =
  | "products"
  | "users"
  | "courses"
  | "usersCoursesAccess"
  | "courseSections"
  | "lessons"

// for global tags
export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const
}

// for single entry tag
export function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${id}-${tag}` as const
}

// for users tags
export function getUserTag(tag: CACHE_TAG, userId: string) {
  return `user:${userId}-${tag}` as const
}

// for courses tags
export function getCourseTag(tag: CACHE_TAG, courseId: string) {
  return `course:${courseId}-${tag}` as const
}
