import {useState} from 'react'

function GradeSubmission({submission, assignment, params, index}) {
    const [isGraded, setGraded] = useState(submission.grade)
    const [grade, setGrade] = useState(submission.grade)


    function handleGrading(event) {
        event.preventDefault()
        console.log(event.target.grade.value)
        const newGrade = event.target.grade.value
        fetch(`/submissions/${submission.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grade: newGrade })
        })
        .then(response => response.json())
        .then((data) => {
            setGrade(newGrade)
            setGraded(true)
            //console.log(data)
        })
    }

    if (isGraded) {
        return (
            <li key={index}>
                <p>Student: {submission.course_enrollment.student.first_name} {submission.course_enrollment.student.last_name}</p>
                <p>{submission.submission_text}</p>
                <p>Submitted At: {submission.submitted_at}</p>
                <p>Grade: {grade}</p>
            </li>
        )
    }
    return (
        <li key={index}>
            <p>Student: {submission.course_enrollment.student.first_name} {submission.course_enrollment.student.last_name}</p>
            <p>{submission.submission_text}</p>
            <p>Submitted At: {submission.submitted_at}</p>
            <form onSubmit={handleGrading}>
                <input type="number" name="grade"></input>
                <button type="submit">Submit Grade</button>
            </form>
        </li>
    )
}

export default GradeSubmission;
