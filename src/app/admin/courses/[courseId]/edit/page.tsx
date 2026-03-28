import PageHeader from "@/components/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import {
  courseSectionsTable,
  coursesTable,
  lessonsTable,
} from "@/drizzle/schema"
import CourseForm from "@/features/courses/components/CourseForm"
import { getCourseIdTag } from "@/features/courses/db/cache/courses"
import { getCourseSectionsCourseTag } from "@/features/courseSections/db/cache/courseSections"
import { getLessonsCourseTag } from "@/features/lessons/db/cache/lessons"
import { asc, eq } from "drizzle-orm"
import { cacheTag } from "next/cache"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const courseIdPromise = params

  return (
    <div className="container my-6">
      <Suspense fallback="Loading...">
        <EditPageContent courseIdPromise={courseIdPromise} />
      </Suspense>
    </div>
  )
}

async function EditPageContent({
  courseIdPromise,
}: {
  courseIdPromise: Promise<{ courseId: string }>
}) {
  const { courseId } = await courseIdPromise
  const course = await getCourse(courseId)
  if (course == null) return notFound()

  return (
    <>
      <PageHeader title={course.name} />
      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons">Lessons</TabsContent>
        <TabsContent value="details">
          <CourseForm course={course} />
        </TabsContent>
      </Tabs>
    </>
  )
}

async function getCourse(id: string) {
  "use cache"
  cacheTag(
    getCourseIdTag(id),
    getCourseSectionsCourseTag(id),
    getLessonsCourseTag(id),
  )

  return db.query.coursesTable.findFirst({
    columns: { id: true, name: true, description: true },
    where: eq(coursesTable.id, id),
    with: {
      courseSections: {
        orderBy: asc(courseSectionsTable.order),
        columns: { id: true, status: true, name: true },
        with: {
          lessons: {
            orderBy: asc(lessonsTable.order),
            columns: {
              id: true,
              status: true,
              name: true,
              description: true,
              videoId: true,
              sectionId: true,
            },
          },
        },
      },
    },
  })
}
