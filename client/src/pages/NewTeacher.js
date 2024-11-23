import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function NewTeacher() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [refreshPage, setRefreshPage] = useState(false);
    const [error, setError] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);

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

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        departmentId: 0,
    }
    const formSchema = yup.object({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        email: yup.string().email('Invalid email format').required('Email is required')
    })


    const formik = useFormik({
        initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log(values)
            fetch("/teachers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((res) => {
                if (res.status === 201) {
                    setRefreshPage(!refreshPage);
                    setIsSubmitted(true);
                    //alert("Successfully signed up!")
                    const interval = setTimeout(() => {
                        navigate("/dashboard");
                    }, 500);
                }
                else if (res.status === 422) {
                    console.log(res.error);
                }
            });
        },
    });

    let departmentOptions = []

    if (departments) {
        departmentOptions = departments.map((department) => {
            return <option key={department.id} value={department.id}>{department.name}</option>
        })
    }

    // Send the email
    function handleEmail() {
        return null
    }


    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h1>Create New Teacher Account</h1>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                <br />
                <input
                    id="firstName"
                    name="firstName"
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                />
                <p style={{ color: "red" }}> {formik.errors.firstName}</p>
                <br />

                <label htmlFor="lastName">Last Name</label>
                <br />
                <input
                    id="lastName"
                    name="lastName"
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                />
                <p style={{ color: "red" }}> {formik.errors.lastName}</p>
                <br />

                <label htmlFor="email">Email Address</label>
                <br />
                <input
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                <p style={{ color: "red" }}> {formik.errors.email}</p>

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

                {isSubmitted ? <button disabled={true}>Submitted</button> : <button type="submit">Submit</button>}

            </form>
            <p>{error}</p>
            {isSubmitted ? <p></p> : null}

            <button name="send-mail" onClick={() => {handleEmail()}}>Send Email</button>
        </div>
    );
}

export default NewTeacher;