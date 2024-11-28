import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function CourseTeacherView({ user, course, assignments, navigate }) {
    console.log(user)
    let mappedAssignments = []

    if (assignments.length === 0) {
        //console.log(assignments)
        mappedAssignments = <li key="no-assignments">No assignments found.</li>
    }
    else {
        mappedAssignments = assignments.map((assignment) => {
            return <li key={assignment.id}>
                <Link to={`/assignments/${assignment.id}`}>{assignment.name}</Link> - Due: {assignment.due_date}
                <p>Published: {assignment.published ? 'Yes' : 'No'}</p>
            </li>
        })
    }

    return (
        <div>
            <h1>{course.name}</h1>
            <p>Department: {course.department.name}</p>
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
            {user.id === course.teacher_id ?
                <button onClick={() => navigate(`/courses/${course.id}/newassignment`)}>Create Assignment</button>
                :
                <></>
            }
        </div>
    )
}

export default CourseTeacherView;