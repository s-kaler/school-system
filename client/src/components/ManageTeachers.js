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


    function handleEmail(teacher) {
        console.log(teacher);
        let fullName = `${teacher.first_name} ${teacher.last_name}`;
        fetch('/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: fullName,
                email: teacher.email,
                userId: teacher.id,
                userType: teacher.userType,
            }),
        })
            .then(res => res.json())
            .then(data => console.log(data))

    }

    const mappedTeachers = teachers.map(teacher => (
        <li key={teacher.id}>
            {teacher.first_name} {teacher.last_name}
            {teacher.verified ? <></> : <button onClick={() => handleEmail(teacher)}>Send Verification Email</button> }
           
        </li>
    ))
    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div className="managed-div">
            <h3>Manage Teachers</h3>
            <ul>
                {mappedTeachers}
            </ul>
            <Link to="/teachers/new">Add New Teacher</Link>
        </div>
    )
}

export default ManageTeachers;