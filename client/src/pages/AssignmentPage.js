import React, {useState, useEffect} from 'react'
import {Link, useOutletContext, useParams} from 'react-router-dom'

function AssignmentPage() {
    const params = useParams()
    const [assignment, setAssignment] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useOutletContext()
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        fetch(`/assignments/${params.assignmentId}`)
           .then(response => response.json())
           .then(data => {
                setAssignment(data)
                console.log(data)
                setIsLoading(false)
            })
    }, [])


    function editAssignment() {
        setIsEditing(true)
    }




    if (isLoading) {
        return <p>Loading...</p>
    }
    if (assignment) {
        if (user) {
            if (user.id === assignment.course.teacher_id) {
                if (isEditing){
                    return (
                        <h2>Editing Assignment: {assignment.name}</h2>
                    )
                }
                else {
                    return (
                        <div>
                            <h1>{assignment.name}</h1>
                            <p>Description: <br />{assignment.description}</p>
                            <p>Due Date: {assignment.due_date}</p>
                            <button onClick={() => editAssignment()}>Edit</button>
                            <br />
                            <Link to={`/courses/${assignment.course_id}`}>Back to Course Page</Link>
                        </div>
                    )
                }
            }
            //else if assignment course is in student's list
        }
        else {
            return (
                <div>
                    <h1>Access Denied</h1>
                    <p>You do not have permission to view this assignment.</p>
                </div>
            )
        }
    }
}

export default AssignmentPage;