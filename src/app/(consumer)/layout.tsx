import { Show } from "@clerk/nextjs"
import Link from "next/link"
import { ReactNode, Suspense } from "react"

export default function ConsumerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function Navbar() {
  return (
    <header className="flex h-12 shadow bg-background z-10">
      <nav className="flex gap-4 container">
        <Link
          className="flex items-center mr-auto text-lg px-2 hover:underline"
          href="/"
        >
          BIM
        </Link>
        <Suspense>
          <Show when="signed-out">
            <Link
              href="/courses"
              className="flex items-center px-2 hover:bg-accent-10"
            >
              My courses
            </Link>
            <Link
              href="/purchases"
              className="flex items-center px-2 hover:bg-accent-10"
            >
              Purchase history
            </Link>
          </Show>
        </Suspense>
      </nav>
    </header>
  )
}
