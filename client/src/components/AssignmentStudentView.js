import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function AssignmentStudentView({ assignment, enrollmentId}) {
    const [enrollment, setEnrollment] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCreatingSubmission, setCreateSubmission] = useState(false)

    useEffect(() => {
        fetch(`/enrollments/${enrollmentId}`)
        .then(response => response.json())
        .then(data => {
            setEnrollment(data)
            setIsLoading(false)
            console.log(data)
            // Fetch the assignment data based on the courseId and enrollmentId
        })
    }, [])

    const initialValues = {
        submission_text: '',
    }

    const formik = useFormik()

    const submissionForm = () => {
        setCreateSubmission(true)
        return (
            <form onSubmit={handleSubmit}>
                <label>
                    Submission:
                    <input type="text" name="submission" value={formik.values.submission} onChange={formik.handleChange} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        )
    }

    if(isLoading) {
        return <p>Loading...</p>
    }
    if(enrollment) {
        return (
            <div>
                <h3>Assignment: {assignment.name}</h3>
                <p>{assignment.description}</p>
                <p>Due: {assignment.due_date}</p>
                <p>Course: {assignment.course.name}</p>
                <p>Student: {enrollment.student.first_name} {enrollment.student.last_name}</p>
                <Link to={`/courses/${assignment.course_id}`}>Back to Course Page</Link>
                <br />
                <br />

                {isCreatingSubmission? (
                    {submissionForm}
                ) : <button onClick={() => setCreateSubmission(true)}>Submit Assignment</button>
                }
            </div>
        )
    }
    else {
        return <p>You are not enrolled in this course.</p>
    }
    
}

export default AssignmentStudentView;