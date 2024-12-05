import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function AssignmentStudentView({ assignment, enrollmentId}) {
    const [enrollment, setEnrollment] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCreatingSubmission, setCreateSubmission] = useState(false)
    const [submission, setSubmission] = useState(null)

    //console.log(assignment)
    useEffect(() => {
        fetch(`/enrollments/${enrollmentId}`)
        .then(response => response.json())
        .then(data => {
            setEnrollment(data)
            setIsLoading(false)
            //console.log(data)
            if(data.submissions) {
                //check if there is already a submission in the array
                const submission = data.submissions.find(submission => submission.assignment_id === assignment.id)
                console.log(submission)
                if(submission) {
                    setSubmission(submission)
                }
                else {
                    setSubmission(null)
                }
            }
        })
    }, [assignment, enrollmentId])

    const initialValues = {
        enrollment_id: enrollmentId,
        assignment_id: assignment.id,
        submission_text: '',
    }

    const formSchema = yup.object({
        submission_text: yup.string().required('Text is required'),
    })

    const formik = useFormik({
        initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/submissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
                setSubmission(data)
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
            {submission ? <button disabled={true}>Submitted</button> : <button type="submit">Submit</button>}
            <button onClick={() => {setCreateSubmission(false)}}>Cancel</button>
        </form>
    )
    
    function handleDelete() {
        fetch(`/submissions/${submission.id}`, {
            method: "DELETE",
        })
        .then (() => {setSubmission(null)})
    }

    if(isLoading) {
        return <p>Loading...</p>
    }
    if(enrollment) {
        if (submission) {
            
            return (
                <div className="assignment-div">
                    <h3>Assignment: {assignment.name}</h3>
                    <p>{assignment.description}</p>
                    <p>Due: {assignment.due_date}</p>
                    <p>Course: {assignment.course.name}</p>
                    <p>Student: {enrollment.student.first_name} {enrollment.student.last_name}</p>
                    <Link to={`/courses/${assignment.course_id}`}>Back to Course Page</Link>
                    <br />
                    <br />
                    <div>
                        <h3>Your Submission</h3>
                        <p>{submission.submission_text}</p>
                        {submission.grade ?
                            <div>
                                <p>Grade: {submission.grade}</p>
                                <p>Date Submitted: {submission.submitted_at}</p>
                            </div>
                            :
                            <div>
                                <div>
                                    <p>Not Yet Graded</p>
                                    <p>Date Submitted: {submission.submitted_at}</p>
                                    <button type='button' onClick={() => handleDelete()}>Delete Submission</button>
                                </div>
                            </div>}
                    </div>
                </div>
            )
        }
        return (
            <div className="assignment-div">
                <h3>Assignment: {assignment.name}</h3>
                <p>{assignment.description}</p>
                <p>Due: {assignment.due_date}</p>
                <p>Course: {assignment.course.name}</p>
                <p>Student: {enrollment.student.first_name} {enrollment.student.last_name}</p>
                <Link to={`/courses/${assignment.course_id}`}>Back to Course Page</Link>
                <br />
                <br />
                {
                    isCreatingSubmission ? submissionForm : <button onClick={() => setCreateSubmission(true)}>Submit Assignment</button>
                }
            </div>
        )
    }
    else {
        return <p>You are not enrolled in this course.</p>
    }
    
}

export default AssignmentStudentView;