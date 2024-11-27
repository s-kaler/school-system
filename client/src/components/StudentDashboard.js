import {useEffect, useState} from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

function StudentDashboard({student}) {
    const [enrollments, setEnrollments] = useState([])
    const [isLoading, setLoading] = useState(true)
    
    useEffect(() => {
        fetch(`/students/${student.id}/enrollments`)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                if(data.length > 0) {
                    setEnrollments(data)
                }
                setLoading(false)
            })
    }, [student.id])

    let  mappedCourses = []
    if (enrollments.length > 0) {
        mappedCourses = enrollments.map(enrollment =>
            <li key={enrollment.id}><Link to={`/courses/${enrollment.course_id}`}>{enrollment.course.name}</Link> - {enrollment.course.description}</li>
        )
    }

    return (
        <div>
            <h2>Student Controls</h2>
            {enrollments.length > 0 ?
            <div>
                <h3>Courses:</h3>
                <ul>
                    {mappedCourses}
                </ul>
            </div>
            :
                <p>No enrolled courses.</p>}
        </div>
    )
}

export default StudentDashboard;