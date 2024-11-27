import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function TeacherDashboard({teacher}) {
    const [courses, setCourses] = useState([])
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
        fetch(`/teachers/${teacher.id}/courses`)
           .then(response => response.json())
           .then((data) => {
                setCourses(data)
                setLoading(false)
            })
    }, [teacher.id])

    let mappedCourses = []
    if (courses.length > 0) {
        mappedCourses = courses.map(course =>
            <li key={course.id}><Link to={`/courses/${course.id}`}>{course.name}</Link> - {course.description}</li>
        )
    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h2>Teacher Controls</h2>
            {courses.length > 0 ?
                <div>
                    <h3>Courses:</h3>
                    <ul>
                        {mappedCourses}
                    </ul>
                </div>
                :
                <p>No assigned courses.</p>}
        </div>
    )
}

export default TeacherDashboard; 