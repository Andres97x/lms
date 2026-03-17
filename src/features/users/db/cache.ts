import { getGlobalTag, getIdTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getUserGlobalTag() {
  return getGlobalTag("users")
}

export function getUserIdTag(userId: string) {
  return getIdTag("users", userId)
}

export function revalidateUserCache(userId: string) {
  revalidateTag(getUserGlobalTag(), { expire: 0 })
  revalidateTag(getUserIdTag(userId), { expire: 0 })
}
