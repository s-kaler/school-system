import {useEffect, useState} from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

function StudentDashboard({student}) {
    const [enrollments, setEnrollments] = useState([])
    const [isLoading, setLoading] = useState(true)
    
    useEffect(() => {
        fetch(`/students/${student.id}/enrollments`)
            .then(response => response.json())
            .then((data) => {
                //console.log(data)
                if(data.length > 0) {
                    setEnrollments(data)
                }
                setLoading(false)
            })
    }, [student.id])

    let approvedCourses = []
    let unapprovedCourses = []
    if (enrollments.length > 0) {
        approvedCourses = enrollments.map(enrollment => {
            if(enrollment.approved) return <li key={enrollment.id}><Link to={`/courses/${enrollment.course_id}`}>{enrollment.course.name}</Link> - {enrollment.course.description}</li>
        })
        unapprovedCourses = enrollments.map(enrollment => {
            if(!enrollment.approved) return <li key={enrollment.id}><Link to={`/courses/${enrollment.course_id}`}>{enrollment.course.name}</Link> - {enrollment.course.description}</li>
        })
    }

    if(isLoading) {
        return <p>Loading...</p>
    }
    return (
        <div>
            <h2>Student Controls</h2>
            {enrollments.length > 0 ?
            <div>
                {approvedCourses.length > 0 ?
                <div>
                    <h3>Enrolled Courses:</h3>
                    <ul>
                        {approvedCourses}
                    </ul>
                </div>
                    :
                    <p>No enrolled courses.</p>
                }
                {unapprovedCourses.length > 0 ?
                    <div>
                        <h3>Courses Applied To:</h3>
                        <ul>
                            {unapprovedCourses}
                        </ul>
                    </div>
                    :
                    <></>
                }
            </div>
            :
                <p>No enrolled courses.</p>}
        </div>
    )
}

export default StudentDashboard;