import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function CourseStudentView({ user, course, assignments, navigate }) {
    const [isRequested, setRequested] = useState(false)
    //console.log(user)
    const enrollment = user.course_enrollments.find(enrollment => enrollment.course_id === course.id)
    //console.log(enrollment)

    let mappedAssignments = []

    function handleEnroll() {
        fetch(`/enrollments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                courseId: course.id,
                studentId: user.id,
            }),
        })
       .then(response => response.json())
       .then((data) => {
            setRequested(true)
        })
    }

    if (assignments.length === 0) {
        //console.log(assignments)
        mappedAssignments = <li key="no-assignments">No assignments found.</li>
    }
    else {
        mappedAssignments = assignments.map((assignment) => {
            if(assignment.published) {
                return <li key={assignment.id}>
                    <Link to={`/assignments/${assignment.id}`}>{assignment.name}</Link> - Due: {assignment.due_date}
                </li>
            }
            
        })
    }

    if (enrollment) {
        if (enrollment.approved) {
            return (
                <div>
                    <h1>{course.name}</h1>
                    <p>Description: <br />{course.description}</p>
                    <p>Taught by {course.teacher.first_name} {course.teacher.last_name}</p>
                    {assignments.length > 0 ?
                        <div>
                            <h3>Assignments:</h3>
                            <ul>
                                {mappedAssignments}
                            </ul>
                        </div>
                        :
                        <p>No assignments found.</p>
                    }
                </div>
            )
        }
        //approved view
        else {
            return (
                <div>
                    <h1>{course.name}</h1>
                    <p>Description: <br />{course.description}</p>
                    <p>Taught by {course.teacher.first_name} {course.teacher.last_name}</p>
                    <button disabled={true}>Not Yet Approved</button>
                </div>
            )
        }
    }
    else {
        //not enrolled view
        return (
            <div>
                <h1>{course.name}</h1>
                <p>Department: {course.department.name}</p>
                <p>Description: <br />{course.description}</p>
                <p>Taught by {course.teacher.first_name} {course.teacher.last_name}</p>
                {
                    isRequested?
                        <button disabled={true}>Not Yet Approved</button>
                        :
                        <button onClick={() => handleEnroll()}>Enroll in Course</button>
                }
                
            </div>
        )
    }
}

export default CourseStudentView;