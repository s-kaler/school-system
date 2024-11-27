import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ManageEnrollments() {
    const [enrollments, setEnrollments] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/approve_enrollments')
           .then(response => response.json())
           .then((data) => {
                setEnrollments(data)
                setLoading(false)
            })
    }, [])

    function handleApproval(response) {
        const approved = {"approved": true}
        fetch(`/enrollments/${response.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(approved, null, 2)
        })
           .then(response => response.json())
           .then(() => {
                setEnrollments(enrollments.filter(enrollment => enrollment.id!== response.id))
            })
    }

    let  mappedEnrollments = []

    if (enrollments.length > 0) {
        mappedEnrollments = enrollments.map((enrollment) => {
            return (
                <li key={enrollment.id}>
                    {enrollment.student.first_name} {enrollment.student.last_name} - <Link to={`/courses/${enrollment.course_id}`}>{enrollment.course.name}</Link>
                    {"  "}<button onClick={() => handleApproval(enrollment)}>Approve</button>
                </li>
            )
        })
    }

    return (
        <div>
            <h3>Manage Enrollments</h3>
            <ul>
                {mappedEnrollments}
            </ul>
        </div>
    )
}

export default ManageEnrollments;