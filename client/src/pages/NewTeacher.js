import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import "../styles/NewModel.css"
import { useUserContext } from '../components/UserContext';

function NewTeacher() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [refreshPage, setRefreshPage] = useState(false);
    const [error, setError] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [departments, setDepartments] = useState([]);
    const { user } = useUserContext();

    useEffect(() => {
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
        email: yup.string().email('Invalid email format').required('Email is required'),
        departmentId: yup.number().min(1, 'Please select a department')
    })

    const formik = useFormik({
        initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            //console.log(values)
            fetch("/teachers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            })
            .then((res) => {
                if (res.status === 201) {
                    res.json((data) => {
                        setIsLoading(false)
                        formik.resetForm()
                        setDepartments([])
                        setError('')
                        const newTeacherId = data.id
                        console.log(newTeacherId)
                    })
                    setRefreshPage(!refreshPage);
                    setIsSubmitted(true);
                    setError('')
                    //alert("Successfully signed up!")
                    const interval = setTimeout(() => {
                        navigate("/dashboard");
                    }, 500);
                }
                else if (res.status === 422) {
                    res.json().then((data) => {
                        setError(data.error)
                    })
                }
            })
        },
    });

    let departmentOptions = []

    if (departments) {
        departmentOptions = departments.map((department) => {
            return <option key={department.id} value={department.id}>{department.name}</option>
        })
    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (!user || user.user_type !== 'admin') {
        return <p>Unauthorized.</p>
    }
    return (
        <div className="new-model-div">
            <h1>Create New Teacher Account</h1>
            <form onSubmit={formik.handleSubmit} className='new-model-form'>
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
                    onChange={(selectedDepartment) => {
                        formik.setFieldValue("departmentId", selectedDepartment.target.value)
                    }}
                >
                    <option value={0}>Select Department</option>  {/* Default option for select */}
                    {departmentOptions}
                </select>
                <br />
                <p style={{ color: "red" }}> {formik.errors.departmentId}</p>
                <br />

                {isSubmitted ? <button className="new-model-btn" disabled={true}>Submitted</button> : <button className="new-model-btn" type="submit">Submit</button>}

            </form>
            <p>{error}</p>
            {isSubmitted ? <p></p> : null}
        </div>
    );
}

export default NewTeacher;