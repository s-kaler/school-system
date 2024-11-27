import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function AssignmentStudentView({ assignment, enrollmentId}) {
    const [enrollment, setEnrollment] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCreatingSubmission, setCreateSubmission] = useState(false)
    const [isSubmitted, setSubmitted] = useState(false)

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

    const formSchema = yup.object({
        submission_text: yup.string().required('Submission is required'),
    })

    const formik = useFormik({
        initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/submissions`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    enrollment_id: enrollmentId,
                    assignment_id: assignment.id,
                    submission_text: values.submission_text,
                }),
            })
           .then(response => response.json())
           .then(data => {
                console.log(data)
                // Update the state of the enrollment with the new submission
                setEnrollment(prevEnrollment => ({
                   ...prevEnrollment,
                    submissions: [...prevEnrollment.submissions, data],
                }))
                setCreateSubmission(false)
            })
        },
    })

    const submissionForm = 
    (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="submission_text">Submission</label>
            <br />
            <textarea
                id="submission_text"
                name="submission_text"
                onChange={formik.handleChange}
                value={formik.values.submission_text}
            />
            <p style={{ color: "red" }}> {formik.errors.submission_text}</p>
            <br />
            {isSubmitted ? <button disabled={true}>Submitted</button> : <button type="submit">Submit</button>}
            <button>Cancel</button>
        </form>
    )
    

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

                {isCreatingSubmission? submissionForm : <button onClick={() => setCreateSubmission(true)}>Submit Assignment</button>
                }
            </div>
        )
    }
    else {
        return <p>You are not enrolled in this course.</p>
    }
    
}

export default AssignmentStudentView;