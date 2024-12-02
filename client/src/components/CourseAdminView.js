import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function CourseAdminView({ user, course, assignments, navigate }) {
    const [isEditing, setIsEditing] = useState(false)
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    //console.log(course)

    useEffect(() => {
        fetch("/teachers")
            .then((res) => res.json())
            .then((data) => { setTeachers(data) })
        fetch("/departments")
            .then(res => res.json())
            .then((data) => {
                setDepartments(data)
                setIsLoading(false)
            })
    }, [])

    let teacherOptions = []

    if (teachers) {
        teacherOptions = teachers.map((teacher) => {
            return <option key={teacher.id} value={teacher.id}>{teacher.first_name} {teacher.last_name}</option>
        })
    }

    let departmentOptions = []

    if (departments) {
        departmentOptions = departments.map((department) => {
            return <option key={department.id} value={department.id}>{department.name}</option>
        })
    }


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

    const initialValues = {
        name: course.name,
        credits: course.credits,
        description: course.description,
        teacher_id: course.teacher.id,
        departmentId: course.department_id,

    }

    const formSchema = yup.object({
        name: yup.string().required('Name is required'),
        credits: yup.number()
           .positive()
           .integer()
           .required('Credits are required')
           .typeError('Enter an integer between 1 and 4')
           .max(4, 'Enter a number between 1 and 4'),
        description: yup.string(),
        teacher_id: yup.number().min(1, 'Please select a teacher'),
        departmentId: yup.number().min(1, 'Please select a department')
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log(values)
            fetch(`/courses/${course.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((res) => {
                if (res.status === 200) {
                    navigate(`/courses/${course.id}`)
                }
                else {
                    alert("Failed to update course")
                }
            })
            setIsEditing(false)
        },
    })

    return (
        <div className="course-div">
            <h1>{course.name}</h1>
            <p>Department: {course.department.name}</p>
            <p>Description: <br />{course.description}</p>
            <p>Taught by {course.teacher.first_name} {course.teacher.last_name}</p>
            {assignments.length > 0 ?
                <div className="assignments-div">
                    <h3>Assignments:</h3>
                    <ul>
                        {mappedAssignments}
                    </ul>
                </div>
                :
                <p>No assignments found.</p>
            }
            {isEditing ? 
                <form onSubmit={formik.handleSubmit} className="edit-course">
                <h3>Editing Course</h3>
                <label htmlFor="name">Name</label>
                <br />
                <input
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
                <br />
                <label htmlFor="credits">Credits</label>
                <br />
                <input
                    id="credits"
                    name="credits"
                    type="number"
                    min="1"
                    max="4"
                    onChange={formik.handleChange}
                    value={formik.values.credits}
                />
                <br />
                <label htmlFor="description">Description</label>
                <br />
                <textarea
                    id="description"
                    name="description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />
                <br />
                    <label htmlFor="departments">Select Department</label>
                    <br />
                    <select
                        name="departments"
                        value={formik.values.departmentId}
                        onChange={(selectedDepartment) => {
                            formik.setFieldValue("departmentId", selectedDepartment.target.value)
                        }}
                    >
                        <option value={0}>Select Department</option>  {/* Default option for select */}
                        {departmentOptions}
                    </select>
                    <br />
                    <p style={{ color: "red" }}> {formik.errors.departmentId}</p>
                    <label htmlFor="teachers">Select Teacher</label>
                    <br />
                    <select
                        name="teachers"
                        value={formik.values.teacher_id}
                        onChange={(selectedTeacher) => {
                            formik.setFieldValue("teacher_id", selectedTeacher.target.value)
                        }}
                    >
                        <option value={0}>Select Teacher</option>  {/* Default option for select */}
                        {teacherOptions}

                    </select>
                    <br />
                    <p style={{ color: "red" }}> {formik.errors.teacher_id}</p>
                    <br />
                <button type="submit">Save Changes</button>
                <button type='button' onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
                :
                <button onClick={() => setIsEditing(true)}>Edit Course</button>
            }
        </div>
    )
}

export default CourseAdminView;