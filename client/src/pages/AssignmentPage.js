import React, {useState, useEffect} from 'react'
import {Link, useOutletContext, useParams,  useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import * as yup from 'yup'

function AssignmentPage() {
    const params = useParams()
    const [assignment, setAssignment] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [sureToDelete, setsureToDelete] = useState(false)
    const [courseId, setCourseId] = useState(null)
    const [initialValues, setInitialValues] = useState({
        name: '',
        description: '',
        published: false,
        published_at: '',
        due_date: '',
        due_time: '',
        course_id: ''
    })
    const navigate = useNavigate()
    const [user, setUser] = useOutletContext()

    useEffect(() => {
        fetch(`/assignments/${params.assignmentId}`)
           .then(response => response.json())
            .then(data => {
                setCourseId(data.course_id)
                const formattedDate = formatDate(data.due_date);
                const formattedTime = formatTime(data.due_date);
                setAssignment({
                    course: data.course,
                    name: data.name,
                    description: data.description,
                    published: data.published,
                    published_at: data.published_at,
                    due_date: formattedDate,
                    due_time: formattedTime,
                    course_id: data.course_id
                })
                setInitialValues({
                    name: data.name,
                    description: data.description,
                    published: data.published,
                    published_at: '',
                    due_date: formattedDate,
                    due_time: formattedTime,
                    course_id: data.course_id
                })
                //console.log(data)
                setIsLoading(false)
            })
    }, [params])


    function editAssignment() {
        setIsEditing(true)
    }

    const formSchema = yup.object({
        name: yup
           .string()
           .required('Name is required'),
        description: yup
           .string()
           .required('Description is required'),
        published: yup
           .boolean()
           .required('Published status is required'),
        due_date: yup
           .date()
           .required('Due date is required')
           .min(new Date(), 'Due date must be in the future')
           .typeError('Due date is required'),
        due_time: yup
            .string()
            .required('Due time is required')
            .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
        course_id: yup
           .number()
           .required('Course ID is required')
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            //console.log(values)
            fetch(`/assignments/${params.assignmentId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values)
            })
            .then(response => response.json())
                .then(data => {
                const formattedDate = formatDate(data.due_date);
                const formattedTime = formatTime(data.due_date);
                setAssignment({
                    course: data.course,
                    name: data.name,
                    description: data.description,
                    published: data.published,
                    published_at: data.published_at,
                    due_date: formattedDate,
                    due_time: formattedTime,
                    course_id: data.course_id
                })
                console.log(data)
                setInitialValues({
                    name: data.name,
                    description: data.description,
                    published: data.published,
                    published_at: '',
                    due_date: formattedDate,
                    due_time: formattedTime,
                    course_id: data.course_id
                })
                setIsEditing(false)
            })
        }
    })

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

    function handleDelete() {
        fetch(`/assignments/${params.assignmentId}`, {
            method: 'DELETE'
        })
        .then(() => {
            navigate(`/courses/${courseId}`)
        })
    }


    if (isLoading) {
        return <p>Loading...</p>
    }
    if (assignment) {
        if (user) {
            if (user.id === assignment.course.teacher_id) {
                if (isEditing){
                    return (
                        <div>

                            <h2>Editing Assignment: {assignment.name}</h2>
                            <form onSubmit={formik.handleSubmit}>
                                <label htmlFor="name">Name</label>
                                <br />
                                <input
                                    id="name"
                                    name="name"
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                />
                                <p style={{ color: "red" }}> {formik.errors.name}</p>
                                <br />
                                <label htmlFor="description">Description</label>
                                <br />
                                <textarea
                                    id="description"
                                    name="description"
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                />
                                <p style={{ color: "red" }}> {formik.errors.description}</p>
                                <br />
                                <label htmlFor="published">Published</label>
                                <br />
                                <input
                                    type="checkbox"
                                    id="published"
                                    name="published"
                                    checked={formik.values.published}
                                    onChange={formik.handleChange}
                                />
                                <br />
                                <label htmlFor="due_date">Due Date</label>
                                <br />
                                <input
                                    type="date"
                                    id="due_date"
                                    name="due_date"
                                    onChange={formik.handleChange}
                                    value={formik.values.due_date}
                                />
                                <p style={{ color: "red" }}> {formik.errors.due_date}</p>
                                <br />
                                <label htmlFor="timeInput">Time:</label>
                                <input
                                    type="time"
                                    id='due_time'
                                    name='due_time'
                                    value={formik.values.due_time}
                                    onChange={formik.handleChange}
                                />
                                <p style={{ color: "red" }}> {formik.errors.due_time}</p>
                                <br />
                                <button type="submit">Save Changes</button>
                                <br />
                                {sureToDelete ?
                                    <button onClick={() => handleDelete()}>Are you Sure?</button>
                                    : 
                                    <button onClick={() => setsureToDelete(true)}>Delete</button>
                                }
                                <br />
                                <button onClick={() => setIsEditing(false)}>Cancel</button>
                            </form>
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                            <h1>{assignment.name}</h1>
                            <p>Description: <br />{assignment.description}</p>
                            <p>Due Date: {assignment.due_date}</p>
                            <p>Due Time: {assignment.due_time}</p>
                            <p>Published: {assignment.published? 'Yes' : 'No'}</p>
                            {assignment.published ? <p>Published At: {assignment.published_at}</p> : <></>}
                            <br />
                            <button onClick={() => editAssignment()}>Edit</button>
                            <br />
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