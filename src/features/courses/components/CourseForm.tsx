"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { courseSchema } from "../schemas/courses"
import z from "zod"
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createCourse, updateCourse } from "../actions/courses"
import { toast } from "sonner"

export default function CourseForm({
  course,
}: {
  course?: { id: string; name: string; description: string }
}) {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ?? {
      name: "",
      description: "",
    },
  })

  async function handleSubmit(values: z.infer<typeof courseSchema>) {
    try {
      const action =
        course == null ? createCourse : updateCourse.bind(null, course.id)
      const data = await action(values)

      if (data.error) {
        toast.error("Error", { description: data.message })
        return
      }

      if (course) {
        toast.success(data.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6"
      >
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabelIcon />
                Description
              </FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
