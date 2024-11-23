import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ManageTeachers() {
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

    const mappedTeachers = teachers.map(teacher => (
        <li key={teacher.id}>
            {teacher.first_name} {teacher.last_name}
        </li>
    ))
    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h3>Manage Teachers</h3>
            <ul>
                {mappedTeachers}
            </ul>
            <Link to="/teachers/new">Add New Teacher</Link>
        </div>
    )
}

export default ManageTeachers;