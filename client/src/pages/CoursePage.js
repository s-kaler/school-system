import { useEffect, useState} from 'react'
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom'
import CourseStudentView from '../components/CourseStudentView'
import CourseTeacherView from '../components/CourseTeacherView'
import CourseAdminView from '../components/CourseAdminView'
import "../styles/CoursePage.css"

function CoursePage() {
    const [user, setUser] = useOutletContext()
    const params = useParams()
    const [course, setCourse] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [assignments, setAssignments] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`/courses/${params.courseId}`)
        .then(response => response.json())
        .then(data => {
            //console.log(user)
            //console.log(data)
            if (data.assignments) {
                setCourse(data)
                if (data.assignments.length > 0) {
                    fetch(`/courses/${params.courseId}/assignments`)
                    .then(response => response.json())
                    .then(assignmentData => {
                        //console.log(assignmentData)
                        setIsLoading(false)
                        setAssignments(assignmentData)
                    })
                }  
            }
            setIsLoading(false)
        })
        
        
    }, [params])

    let mappedAssignments = []

    

    if (isLoading) {return <p>Loading...</p>}
    else {
        if (assignments.length === 0) {
            //console.log(assignments)
            mappedAssignments = <li key="no-assignments">No assignments found.</li>
        }
        else {
            mappedAssignments = assignments.map((assignment) => {
                return <li key={assignment.id}>
                    <Link to={`/assignments/${assignment.id}`}>{assignment.name}</Link> - Due: {assignment.due_date}
                    <p>Published: {assignment.published ? 'Yes' : 'No'}</p>
                </li>
            })
        }
    }
    
    if (course) {
        if (user) {
            //admin view
            if (user.user_type === 'admin') {
                return (
                    <CourseAdminView user={user} params={params} course={course} setCourse={setCourse} courseId={params.courseId} assignments={assignments} navigate={navigate} />
                )
            }
            //teacher and admin view
            if (user.user_type === 'teacher') {
                return (
                    <CourseTeacherView user={user} params={params} course={course} setCourse={setCourse} courseId={params.courseId} assignments={assignments} navigate={navigate} />
                )
            }
            //student view
            else {
                //student view
                if (user.user_type === 'student') {
                    return (
                        <CourseStudentView user={user} params={params} course={course} setCourse={setCourse} courseId={params.courseId} assignments={assignments} navigate={navigate} />
                    )
                }
                return (
                    <div className="course-div">
                        <h1>{course.name}</h1>
                        <p>Department: {course.department.name}</p>
                        <p>Description: <br />{course.description}</p>
                        <p>Credits: {course.credits}</p>
                        <p>Taught by {course.teacher.first_name} {course.teacher.last_name}</p>
                        {assignments.length > 0?
                            <div>
                                <h3>Assignments:</h3>
                                <ul>
                                    {mappedAssignments}
                                </ul>
                            </div>
                            :
                            <p>No assignments found.</p>
                        }
                    </div>
                )
            }
        }
        return (
            <div className="course-div">
                <h1>{course.name}</h1>
                <p>Description: <br />{course.description}</p>
                <p>Credits: {course.credits}</p>
                <p>Taught by {course.teacher.first_name} {course.teacher.last_name}</p>
            </div>
        )
    }
    else {
        return <p>Course not found.</p>
    }
}

export default CoursePage;