"use client"

import { CourseSectionsStatus, courseSectionsStatuses } from "@/drizzle/schema"
import { useForm } from "react-hook-form"
import z from "zod"
import { courseSectionSchema } from "../schemas/courseSection"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import RequiredLabelIcon from "@/components/RequiredLabelIcon"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { createSection, updateSection } from "../actions/courseSections"
import { toast } from "sonner"

export default function SectionForm({
  courseId,
  section,
  onSuccess,
}: {
  courseId: string
  section?: {
    id: string
    name: string
    status: CourseSectionsStatus
  }
  onSuccess?: () => void
}) {
  const form = useForm<z.infer<typeof courseSectionSchema>>({
    resolver: zodResolver(courseSectionSchema),
    defaultValues: section ?? { name: "", status: "public" },
  })

  async function handleSubmit(values: z.infer<typeof courseSectionSchema>) {
    const action = section
      ? updateSection.bind(null, section.id)
      : createSection.bind(null, courseId)
    const data = await action(values)

    if (data.error) {
      toast.error(data.message)
      return
    }

    toast.success(data.message)
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6 @container"
      >
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon />
                  Name
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    {courseSectionsStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
