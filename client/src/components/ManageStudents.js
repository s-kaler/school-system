import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ManageStudents() {
    const [students, setStudents] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/students')
            .then(response => response.json())
            .then((data) => {
                setStudents(data)
                setLoading(false)
            })
    }, [])

    const mappedStudents = students.map(student => (
        <li key={student.id}>
            {student.first_name} {student.last_name}
        </li>
    ))

    if (isLoading) {
        return <p>Loading...</p>
    }
    return (
        <div>
            <h3>Manage Students</h3>
            <ul>
                {mappedStudents}
            </ul>
            <Link to="/students/new">Add New Student</Link>
        </div>
    )
}

export default ManageStudents;