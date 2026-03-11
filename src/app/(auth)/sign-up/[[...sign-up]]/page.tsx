import { SignUp } from "@clerk/nextjs"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback="loading">
      <SignUp />
    </Suspense>
  )
}
