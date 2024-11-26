import { useEffect, useState} from 'react'
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom'

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
                    .then(data => {
                        //console.log(data)
                        setIsLoading(false)
                        setAssignments(data)
                    })
                }  
            }
        })
        
        
    }, [params])

    let mappedAssignments = []

    

    if (isLoading) {<p>Loading...</p>}
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
        if (isLoading) { <p>Loading...</p> }
        if (user) {
            return (
                <div>
                    <h1>{course.name}</h1>
                    <p>Description: <br />{course.description}</p>
                    <p>Taught by {course.teacher.first_name} {course.teacher.last_name}</p>
                    {assignments.length > 0  ? 
                        <div>
                            <h3>Assignments:</h3>
                            <ul>
                                {mappedAssignments}
                            </ul>
                        </div>
                        :
                        <p>No assignments found.</p>
                    }
                    
                    {user.id === course.teacher_id ?
                    <button onClick={() => navigate(`/courses/${course.id}/newassignment`)}>Create Assignment</button>
                    :
                    <></>}
                </div>
                )
        }
        else {
            <div>
                <h1>{course.name}</h1>
                <p>Description: <br />{course.description}</p>
            </div>
        }
    }
    else {
        return <p>Course not found.</p>
    }
}

export default CoursePage;