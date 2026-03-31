"use client"

import SortableList, { SortableItem } from "@/components/SortableList"
import { CourseSectionsStatus } from "@/drizzle/schema"
import { cn } from "@/lib/utils"
import { EyeClosedIcon, EyeIcon, Trash2Icon } from "lucide-react"
import SectionFormDialog from "./SectionFormDialog"
import { DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ActionButton } from "@/components/ActionButton"
import { deleteSection, updateSectionsOrder } from "../actions/courseSections"

export default function SortableSectionsList({
  courseId,
  sections,
}: {
  courseId: string
  sections: { id: string; name: string; status: CourseSectionsStatus }[]
}) {
  return (
    <SortableList items={sections} onOrderChange={updateSectionsOrder}>
      {(items) =>
        items.map((section) => (
          <SortableItem
            key={section.id}
            id={section.id}
            className="flex items-center gap-1"
          >
            <div
              className={cn(
                "contents",
                section.status === "private" && "text-muted-foreground",
              )}
            >
              {section.status === "private" ? (
                <EyeClosedIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
              {section.name}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <SectionFormDialog courseId={courseId} section={section}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </DialogTrigger>
              </SectionFormDialog>

              <ActionButton
                action={deleteSection.bind(null, section.id)}
                requireAreYouSure
                variant="destructive"
                size="sm"
              >
                <Trash2Icon />
                <span className="sr-only">Delete</span>
              </ActionButton>
            </div>
          </SortableItem>
        ))
      }
    </SortableList>
  )
}
