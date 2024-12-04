import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {useFormik} from 'formik'
import * as yup from 'yup'
import "../styles/NewModel.css"
import { useUserContext } from '../components/UserContext';

function NewStudent() {
    const navigate = useNavigate()
    const [refreshPage, setRefreshPage] = useState(false);
    const [error, setError] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { user } = useUserContext();

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
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
            fetch("/students", {
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
                    res.json().then((data) => {
                        setError(data.error)
                    })
                }
            });
        },
    });

    if (!user || user.user_type !== 'admin') {
        return <p>Unauthorized.</p>
    }
    return (
        <div className="new-model-div">
            <h1>Create New Student Account</h1>
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

                {isSubmitted ? <button className="new-model-btn" disabled={true}>Submitted</button> : <button className="new-model-btn" type="submit">Submit</button>}

            </form>
            <p>{error}</p>
            {isSubmitted ? <p></p> : null}
        </div>
    );

}

export default NewStudent;