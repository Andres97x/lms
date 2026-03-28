import { Button } from "@/components/ui/button"
import PageHeader from "@/components/PageHeader"
import Link from "next/link"
import { CoursesTable } from "@/features/courses/components/CoursesTable"
import { cacheTag } from "next/cache"
import { getCoursesGlobalTag } from "@/features/courses/db/cache/courses"
import { db } from "@/drizzle/db"
import {
  courseSectionsTable,
  coursesTable,
  lessonsTable,
  usersCoursesAccess,
} from "@/drizzle/schema"
import { asc, count, eq, sql } from "drizzle-orm"
import { getUsersCoursesAccessGlobalTag } from "@/features/usersCourses/db/cache/usersCoursesAccess"
import { getCourseSectionsGlobalTag } from "@/features/courseSections/db/cache/courseSections"

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
  cacheTag(
    getCoursesGlobalTag(),
    getCourseSectionsGlobalTag(),
    getUsersCoursesAccessGlobalTag(),
  )

  const sectionsCountSq = db
    .select({
      courseId: courseSectionsTable.courseId,
      sectionsCount: count(courseSectionsTable.id).as("sections_count"),
    })
    .from(courseSectionsTable)
    .groupBy(courseSectionsTable.courseId)
    .as("sections_count_sq")

  const lessonsCountSq = db
    .select({
      courseId: courseSectionsTable.courseId,
      lessonsCount: count(lessonsTable.id).as("lessons_count"),
    })
    .from(lessonsTable)
    .leftJoin(
      courseSectionsTable,
      eq(courseSectionsTable.id, lessonsTable.sectionId),
    )
    .groupBy(courseSectionsTable.courseId)
    .as("lessons_count_sq")

  const studentsCountSq = db
    .select({
      courseId: usersCoursesAccess.courseId,
      studentsCount: count(usersCoursesAccess.userId).as("students_count"),
    })
    .from(usersCoursesAccess)
    .groupBy(usersCoursesAccess.courseId)
    .as("students_count_sq")

  return db
    .select({
      id: coursesTable.id,
      name: coursesTable.name,
      sectionsCount: sql<number>`CAST(COALESCE(${sectionsCountSq.sectionsCount}, 0) AS INTEGER)`,
      lessonsCount: sql<number>`CAST(COALESCE(${lessonsCountSq.lessonsCount}, 0) AS INTEGER)`,
      studentsCount: sql<number>`CAST(COALESCE(${studentsCountSq.studentsCount}, 0) AS INTEGER)`,
    })
    .from(coursesTable)
    .leftJoin(sectionsCountSq, eq(sectionsCountSq.courseId, coursesTable.id))
    .leftJoin(lessonsCountSq, eq(lessonsCountSq.courseId, coursesTable.id))
    .leftJoin(studentsCountSq, eq(studentsCountSq.courseId, coursesTable.id))
    .orderBy(asc(coursesTable.name))
}

// heavy query
// async function getCourses() {
//   "use cache"
//   cacheTag(getCoursesGlobalTag())

//   return db
//     .select({
//       id: coursesTable.id,
//       name: coursesTable.name,
//       sectionsCount: countDistinct(courseSectionsTable.id),
//       lessonsCount: countDistinct(lessonsTable.id),
//       studentsCount: countDistinct(usersCoursesAccess.userId),
//     })
//     .from(coursesTable)
//     .leftJoin(
//       courseSectionsTable,
//       eq(coursesTable.id, courseSectionsTable.courseId),
//     )
//     .leftJoin(lessonsTable, eq(courseSectionsTable.id, lessonsTable.sectionId))
//     .leftJoin(
//       usersCoursesAccess,
//       eq(coursesTable.id, usersCoursesAccess.courseId),
//     )
//     .orderBy(asc(coursesTable.name))
//     .groupBy(coursesTable.id)
// }
