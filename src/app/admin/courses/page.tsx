import { Button } from "@/components/ui/button"
import PageHeader from "@/components/PageHeader"
import Link from "next/link"
import { CoursesTable } from "@/features/courses/components/CoursesTable"
import { cacheTag } from "next/cache"
import { getCoursesGlobalTag } from "@/features/courses/db/cache"
import { db } from "@/drizzle/db"
import {
  courseSectionsTable,
  coursesTable,
  lessonsTable,
  usersCoursesAccess,
} from "@/drizzle/schema"
import { asc, countDistinct, eq } from "drizzle-orm"

export default async function CoursesPages() {
  const courses = await getCourses()

  return (
    <div className="container my-6">
      <PageHeader title="Courses">
        <Button asChild>
          <Link href="/admin/courses/new">New course</Link>
        </Button>
      </PageHeader>
      <CoursesTable courses={courses} />
    </div>
  )
}

async function getCourses() {
  "use cache"
  cacheTag(getCoursesGlobalTag())

  return db
    .select({
      id: coursesTable.id,
      name: coursesTable.name,
      sectionsCount: countDistinct(courseSectionsTable.id),
      lessonsCount: countDistinct(lessonsTable.id),
      studentsCount: countDistinct(usersCoursesAccess.userId),
    })
    .from(coursesTable)
    .leftJoin(
      courseSectionsTable,
      eq(coursesTable.id, courseSectionsTable.courseId),
    )
    .leftJoin(lessonsTable, eq(courseSectionsTable.id, lessonsTable.sectionId))
    .leftJoin(
      usersCoursesAccess,
      eq(coursesTable.id, usersCoursesAccess.courseId),
    )
    .orderBy(asc(coursesTable.name))
    .groupBy(coursesTable.id)
}
