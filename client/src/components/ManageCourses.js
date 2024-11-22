import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ManageCourses() {
    const [courses, setCourses] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/courses')
           .then(response => response.json())
           .then((data) => {
                setCourses(data)
                setLoading(false)
            })
    }, [])

    const mappedCourses = courses.map(course => (
        <li key={course.id}>
            {course.name} - {course.description}
        </li>
    ))
    if (isLoading) {
        return <p>Loading...</p>
    }
    return (
        <div>
            <h1>Manage Courses</h1>
            <ul>
                {mappedCourses}
            </ul>
            <Link to="/courses/new">Add New Course</Link>
        </div>
    )
}

export default ManageCourses;