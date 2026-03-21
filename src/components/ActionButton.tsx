"use client"

import { ComponentProps, ReactNode, useTransition } from "react"
import { Button } from "./ui/button"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog"

export function ActionButton({
  action,
  requireAreYouSure = false,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick"> & {
  action: () => Promise<{ error?: boolean; success?: boolean; message: string }>
  requireAreYouSure?: boolean
}) {
  const [isPending, startTransition] = useTransition()

  function performAction() {
    startTransition(async () => {
      const data = await action()

      if (data.error) {
        toast.error("Error", { description: data.message })
        return
      }

      toast.success("Success", { description: data.message })
    })
  }

  // if (requireAreYouSure())

  return (
    <div>
      <Button onClick={performAction} disabled={isPending} {...props}>
        <LoadingTextSwap isLoading={isPending}>
          {props.children}
        </LoadingTextSwap>
      </Button>
    </div>
  )
}

function LoadingTextSwap({
  isLoading,
  children,
}: {
  isLoading: boolean
  children: ReactNode
}) {
  return (
    <div className="grid items-center justify-items-center">
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2",
          isLoading ? "invisible" : "visible",
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2 text-center",
          isLoading ? "visible" : "invisible",
        )}
      >
        <Loader2Icon className="animate-spin" />
      </div>
    </div>
  )
}
