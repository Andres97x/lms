import { Button } from "@/components/ui/button"
import { canAccessAdminPages } from "@/permissions/general"
import { getCurrentUser } from "@/services/clerk"
import { Show, SignInButton, UserButton } from "@clerk/nextjs"
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
          <Show when="signed-in">
            <AdminLink />
            <Link
              href="/courses"
              className="flex items-center px-2 hover:bg-accent/10"
            >
              My courses
            </Link>
            <Link
              href="/purchases"
              className="flex items-center px-2 hover:bg-accent/10"
            >
              Purchase history
            </Link>
            <div className="size-8 self-center cursor-pointer">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: "100%", height: "100%" },
                  },
                }}
              />
            </div>
          </Show>
        </Suspense>
        <Suspense>
          <Show when="signed-out">
            <Button className="self-center cursor-pointer" asChild>
              <SignInButton />
            </Button>
          </Show>
        </Suspense>
      </nav>
    </header>
  )
}

async function AdminLink() {
  const user = await getCurrentUser()

  if (!canAccessAdminPages(user)) return null

  return (
    <Link href="/admin" className="flex items-center px-2 hover:bg-accent/10">
      Admin
    </Link>
  )
}
