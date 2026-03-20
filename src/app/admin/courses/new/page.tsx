import PageHeader from "@/components/PageHeader"
import CourseForm from "@/features/courses/components/CourseForm"

export default function NewCoursePage() {
  return (
    <div>
      <div className="container my-8">
        <PageHeader title="New course" />
        <CourseForm />
      </div>
    </div>
  )
}
