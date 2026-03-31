import PageHeader from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/drizzle/db"
import {
  courseSectionsTable,
  coursesTable,
  lessonsTable,
} from "@/drizzle/schema"
import CourseForm from "@/features/courses/components/CourseForm"
import { getCourseIdTag } from "@/features/courses/db/cache/courses"
import SectionFormDialog from "@/features/courseSections/components/SectionFormDialog"
import SortableSectionsList from "@/features/courseSections/components/SortableSectionsList"
import { getCourseSectionsCourseTag } from "@/features/courseSections/db/cache/courseSections"
import { getLessonsCourseTag } from "@/features/lessons/db/cache/lessons"
import { cn } from "@/lib/utils"
import { asc, eq } from "drizzle-orm"
import { EyeClosed, EyeClosedIcon, EyeIcon, PlusIcon } from "lucide-react"
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

        <TabsContent value="lessons">
          <Card>
            <CardHeader className="flex items-center flex-row justify-between">
              <CardTitle>Sections</CardTitle>
              <SectionFormDialog courseId={course.id}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusIcon /> New section
                  </Button>
                </DialogTrigger>
              </SectionFormDialog>
            </CardHeader>
            <CardContent>
              <SortableSectionsList
                courseId={course.id}
                sections={course.courseSections}
              />
            </CardContent>
          </Card>

          <hr className="my-4" />

          {course.courseSections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="flex items-center flex-row justify-between gap-4">
                <CardTitle
                  className={cn(
                    "flex items-center gap-2",
                    section.status === "private" && "text-muted-foreground",
                  )}
                >
                  {section.status === "private" ? (
                    <EyeClosedIcon className="text-muted-foreground" />
                  ) : (
                    <EyeIcon />
                  )}
                  {section.name}
                </CardTitle>
                <SectionFormDialog courseId={course.id}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <PlusIcon /> New section
                    </Button>
                  </DialogTrigger>
                </SectionFormDialog>
              </CardHeader>
              <CardContent>
                <SortableSectionsList
                  courseId={course.id}
                  sections={course.courseSections}
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CourseForm course={course} />
            </CardHeader>
          </Card>
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
