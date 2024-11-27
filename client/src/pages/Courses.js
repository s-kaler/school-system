import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

function Courses() {
    const [departments, setDepartments] = useState([])
    const [courses, setCourses] = useState([])
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
        fetch('/departments')
        .then(response => response.json())
        .then((data) => {
            setDepartments(data)
        })
        fetch('/courses')
        .then(response => response.json())
        .then((data) => {
            setCourses(data)
            setLoading(false)
        })
    }, [])
    
    const departmentList = departments.map((department) => {
        return (
            <div key={department.id}>
                <h3>{department.name}</h3>
                <ul>
                    {departmentCourses(department)}
                </ul>
            </div>
        )
    })

    function departmentCourses(department) {
        const departmentCourses = courses.filter(course => course.department_id === department.id)
        const mappedDepartmentCourses = departmentCourses.map((course) => (
            <li key={course.id}>
                <Link to={`/courses/${course.id}`}>{course.name}</Link>
            </li>
        ))
        return mappedDepartmentCourses
    }

    if (isLoading) {
        return <p>Loading...</p>
    }
    return (
        <div>
            <h1>Courses</h1>
            {departmentList}
        </div>
    )
}

export default Courses;