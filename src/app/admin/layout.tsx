import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { canAccessAdminPages } from "@/permissions/general"
import { getCurrentUser } from "@/services/clerk"
import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { ReactNode, Suspense } from "react"

export default function AdminLayout({
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
        <div className="flex items-center gap-2 mr-auto">
          <Link className="text-lg hover:underline" href="/">
            BIM
          </Link>
          <Badge>Admin</Badge>
        </div>
        <Link
          href="/admin/courses"
          className="flex items-center px-2 hover:bg-accent/10"
        >
          Courses
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center px-2 hover:bg-accent/10"
        >
          Products
        </Link>
        <Link
          href="/admin/sales"
          className="flex items-center px-2 hover:bg-accent/10"
        >
          Sales
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
      </nav>
    </header>
  )
}
