import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

//not implemented
function Teachers() {
    const [teachers, setTeachers] = useState([])
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
        fetch('/teachers')
           .then(response => response.json())
           .then((data) => {
                setTeachers(data)
                setLoading(false)
            })
    }, [])

    const teacherList = teachers.map((teacher) => (
        <li key={teacher.id}>
            <Link to={`/teachers/${teacher.id}`}>{teacher.first_name} {teacher.last_name}</Link>
        </li>
    ))
    if (isLoading) {
        return <p>Loading...</p>
    }
    return (
        <div>
            <h1>Teachers</h1>
            <ul>
                {teacherList}
            </ul>
        </div>
    )
}

export default Teachers;