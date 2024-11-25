import { useEffect, useState} from 'react'
import { BrowserRouter as Router, Switch, Route, Link, useOutletContext } from 'react-router-dom'

function CoursePage() {
    const [user, setUser] = useOutletContext()

    if (user) {
        if (user.type === 'teacher') {

        }
        if (user.type === 'student') {
            
        }
    }
    return (
        <div>
            <h1>Course Page</h1>
            <p>Welcome, Course!</p>
        </div>
    )
}

export default CoursePage;