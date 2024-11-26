import {useEffect, useState} from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

function StudentDashboard({student}) {
    const [courses, setCourses] = useState([])
    const [isLoading, setLoading] = useState(true)
    /*
    useEffect(() => {
        fetch(`/students/${student.id}/courses`)
            .then(response => response.json())
            .then((data) => {
                setCourses(data)
                setLoading(false)
            })
    }, [student.id])
    */

    return (
        <div>
            <h1>Student Dashboard</h1>
            <p>Welcome, Student!</p>
        </div>
    )
}

export default StudentDashboard;