import React, { useState, useEffect } from 'react'
import { Link, useParams, useOutletContext, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import "../styles/NewModel.css"

function NewAssignment() {
    const params = useParams()
    const [course, setCourse] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [user, setUser] = useOutletContext()

    useEffect(() => {
        fetch(`/courses/${params.courseId}`)
           .then(response => response.json())
           .then((data) => {
                setCourse(data)
                setIsLoading(false)
            })
    }, [params.courseId])

    const initialValues = {
        courseId: params.courseId,
        name: '',
        description: '',
        published: false,
        published_at: '',
        due_date: '',
    }

    const formSchema = yup.object({
        name: yup.string().required('Title is required'),
        description: yup.string().required('Description is required'),
        published: yup.boolean(),
    })

    const formik = useFormik({
        initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            //console.log(values)
            fetch("/assignments", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                setIsLoading(true)
                navigate(`/courses/${course.id}`)
                // Redirect to course page
                // history.push(`/courses/${params.courseId}`)
            })
        }
    })
    if(isLoading) return <p>Loading...</p>
    if(!course) return <p>Course not found.</p>
    if (!user || user.id !== course.teacher_id) return <p>Unauthorized.</p>
    else {
        return (
            <div className="new-model-div">
                <h1>Create New Assignment</h1>
                <form onSubmit={formik.handleSubmit} className='new-model-form'>
                    <label htmlFor="name">Title</label>
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
                    <button type='submit'>Submit</button>
                    <br />
                </form>
                <br />
                <Link to={`/courses/${course.id}`}>Back to Course Page</Link>
            </div>
        )
    }
}

export default NewAssignment;