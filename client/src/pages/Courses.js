import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import NewCourse from './NewCourse'

function Courses() {

    return (
        <div>
            <h1>Courses</h1>
            <ul>
                <li><Link to="/courses/math">Math</Link></li>
                <li><Link to="/courses/science">Science</Link></li>
                <li><Link to="/courses/english">English</Link></li>
            </ul>
        </div>
    )
}

export default Courses;