"use client"

import {
  ReactNode,
  startTransition,
  useId,
  useOptimistic,
  useTransition,
} from "react"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { GripVerticalIcon } from "lucide-react"
import { toast } from "sonner"

export default function SortableList<T extends { id: string }>({
  items,
  onOrderChange,
  children,
}: {
  items: T[]
  onOrderChange: (
    newOrder: string[],
  ) => Promise<{ error: boolean; message: string }>
  children: (items: T[]) => ReactNode
}) {
  const id = useId()
  const [optimisticItems, setOptimisticItems] = useOptimistic(items)
  const [, startTransition] = useTransition()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const activeId = active.id.toString()
    const overId = over?.id.toString()
    if (overId == null || activeId == null) return

    function getNewArray(array: T[], activeId: string, overId: string) {
      const oldIndex = array.findIndex((section) => section.id === activeId)
      const newIndex = array.findIndex((section) => section.id === overId)
      return arrayMove(array, oldIndex, newIndex)
    }

    startTransition(async () => {
      setOptimisticItems((items) => getNewArray(items, activeId, overId))
      const result = await onOrderChange(
        getNewArray(items, activeId, overId).map((section) => section.id),
      )

      if (result.error) {
        toast.error("Error", { description: result.message })
        return
      }

      toast.success("Success", { description: result.message })
    })
  }

  return (
    <DndContext onDragEnd={handleDragEnd} id={id}>
      <SortableContext
        items={optimisticItems}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col">{children(optimisticItems)}</div>
      </SortableContext>
    </DndContext>
  )
}

export function SortableItem({
  id,
  children,
  className,
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  const {
    setNodeRef,
    transform,
    transition,
    activeIndex,
    index,
    attributes,
    listeners,
  } = useSortable({ id })

  const isActive = activeIndex === index

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex gap-1 items-center bg-background rounded-lg p-2",
        isActive && "z-10 border shadow-md",
      )}
    >
      <GripVerticalIcon
        className="text-muted-foreground size-6 p-1 cursor-grab"
        {...attributes}
        {...listeners}
      />
      <div className={cn("grow", className)}>{children}</div>
    </div>
  )
}
