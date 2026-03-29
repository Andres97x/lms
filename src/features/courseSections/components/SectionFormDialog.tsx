"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CourseSectionsStatus } from "@/drizzle/schema"
import { ReactNode, useState } from "react"
import SectionForm from "./SectionForm"

export default function SectionFormDialog({
  courseId,
  section,
  children,
}: {
  courseId: string
  section?: {
    id: string
    name: string
    status: CourseSectionsStatus
  }
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {section == null ? "New section" : `Edit ${section.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SectionForm
            courseId={courseId}
            section={section}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
