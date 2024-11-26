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

    function handleEdit(course) {

    }


    const mappedCourses = courses.map(course => (
        <li key={course.id}>
            <Link to={`/courses/${course.id}`}>{course.name}</Link> - {course.description}
            <br/>
            Taught by {course.teacher.first_name} {course.teacher.last_name}
            <br />
            <button onClick={() => handleEdit(course)}>Edit</button>
        </li>
    ))


    if (isLoading) {
        return <p>Loading...</p>
    }
    return (
        <div>
            <h3>Manage Courses</h3>
            <ul>
                {mappedCourses}
            </ul>
            <Link to="/courses/new">Add New Course</Link>
        </div>
    )
}

export default ManageCourses;