import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function NewCourse() {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [refreshPage, setRefreshPage] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/teachers")
        .then((res) => res.json())
        .then((data) => {setTeachers(data)})
        fetch("/departments")
        .then(res => res.json())
        .then((data) => {
            setDepartments(data)
            setIsLoading(false)
        })
    }, [])

    let teacherOptions =  []

    if (teachers) {
        teacherOptions = teachers.map((teacher) => {
            return <option key={teacher.id} value={teacher.id}>{teacher.first_name} {teacher.last_name}</option>
        })
    }

    let departmentOptions = []

    if (departments) {
        departmentOptions  = departments.map((department) => {
            return <option key={department.id} value={department.id}>{department.name}</option>
        })
    }

    const initialValues = {
        name: '',
        credits: 0,
        description: '',
        teacherId: 0,
        departmentId: 0,
    }

    const formSchema = yup.object({
        name: yup.string().required('Name is required'),
        credits: yup.number()
            .positive()
            .integer()
            .required('Credits are required')
            .typeError('Enter an integer between 1 and 4')
            .max(4, 'Enter a number between 1 and 4'),
        description: yup.string()
    })


    const formik = useFormik({
        initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((res) => {
                if (res.status == 201) {
                    setRefreshPage(!refreshPage);
                    setIsSubmitted(true);
                    //alert("Successfully signed up!")
                    const interval = setTimeout(() => {
                        navigate("/dashboard");
                    }, 500);

                }
                else if (res.status == 422) {
                    console.log(res.error);
                }
            });
        },
    });

    if(isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h1>Create New Course</h1>
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

                <label htmlFor="name">Credits</label>
                <br />
                <input
                    id="credits"
                    name="credits"
                    onChange={formik.handleChange}
                    value={formik.values.credits}
                />
                <p style={{ color: "red" }}> {formik.errors.credits}</p>
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

                <label htmlFor="departments">Select Department</label>
                <br />
                <select
                    name="departments"
                    value={formik.values.departmentId}
                    onChange={formik.handleChange}
                >
                    {departmentOptions}
                </select>
                <br />

                <label htmlFor="teachers">Select Teacher</label>
                <br />
                <select 
                    name="teachers" 
                    value={formik.values.teacherId}
                    onChange={formik.handleChange}
                >
                    {teacherOptions}
                </select>
                <br />
                <br />

                {isSubmitted ? <button disabled={true}>Submitted</button> : <button type="submit">Submit</button>}

            </form>
            <p>{error}</p>
            {isSubmitted ? <p></p> : null}
        </div>
    );

}

export default NewCourse;