import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import AssignmentTeacherView from '../components/AssignmentTeacherView'
import AssignmentStudentView from '../components/AssignmentStudentView'
import "../styles/Assignment.css"
import { useUserContext } from '../components/UserContext';

function AssignmentPage() {
    const params = useParams()
    const [assignment, setAssignment] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [courseId, setCourseId] = useState(null)
    const { user } = useUserContext();

    useEffect(() => {
        fetch(`/assignments/${params.assignmentId}`)
           .then(response => response.json())
            .then(data => {
                setCourseId(data.course_id)
                const formattedDate = formatDate(data.due_date);
                const formattedTime = formatTime(data.due_date);
                setAssignment({
                    id: data.id,
                    course: data.course,
                    name: data.name,
                    description: data.description,
                    published: data.published,
                    published_at: data.published_at,
                    due_date: formattedDate,
                    due_time: formattedTime,
                    course_id: data.course_id
                })
                //console.log(data)
                setIsLoading(false)
            })
    }, [params])


    function formatDate(jsonDate) {
        if (jsonDate) {
            // Parse the datetime string
            const dateObj = new Date(jsonDate);
            // Extract date and time components
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Pad month with leading zero if needed
            const day = String(dateObj.getDate()).padStart(2, '0');
            // Create separate date and time objects for form initial values

            return `${year}-${month}-${day}`;
        }
        else return 'None'
    }

    function formatTime(jsonDate) {
        if(jsonDate) {
            // Parse the datetime string
            const dateObj = new Date(jsonDate);
            // Extract date and time components
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');

            return `${hours}:${minutes}`;
        }
        else return 'None'
        
    }


    if (isLoading) {
        return <p>Loading...</p>
    }
    if (assignment) {
        if (user) {
            if (user.id === assignment.course.teacher_id) {
                return <AssignmentTeacherView params={params} assignment={assignment} setAssignment={setAssignment} courseId={courseId} formatDate={formatDate} formatTime={formatTime}/>
            }
            //else if assignment course is in student's list
            else if (user.user_type === 'student')  {
                const enrollment = user.course_enrollments.find(enrollment => enrollment.course_id === courseId)
                return <AssignmentStudentView params={params} assignment={assignment} enrollmentId={enrollment.id}/>
            }
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