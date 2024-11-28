import { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import {Formik, useFormik} from 'formik'
import * as yup from 'yup'

function Verify(){
    const params = useParams()
    const [user, setUser] = useOutletContext()
    const [newUser, setNewUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [initialDetails, setInitialDetails] = useState({
        firstName: '',
        lastName: '',
        verified: true,
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)
        fetch(`/users/${params.userId}`)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    if (!data.verified) {
                        setUser(null)
                    }
                    setNewUser(data)
                    setInitialDetails({
                        firstName: newUser['first_name'],
                        lastName: newUser['last_name'],
                        verified: true,
                        password: '',
                        confirmPassword: '',
                    })
                    setIsLoading(false)
                    console.log(data)
                })
            }
            else {
                setIsLoading(false)
            }
        })
        
    }, [])

    const initialToken = {
        token: ''
    }

    const tokenSchema = yup.object({
        token: yup
            .number()
            .required('Verification code is required')
            .typeError('Enter a 4 digit number')
            .max(9999, 'Enter a 4 digit number')
    })

    const tokenFormik = useFormik({
        initialValues: initialToken,
        validationSchema: tokenSchema,
        onSubmit: (values) => {
            //console.log(values)
            if (values.token === newUser['verification_code']) {
                //setIsLoading(true)
                setInitialDetails({
                    firstName: newUser['first_name'],
                    lastName: newUser['last_name'],
                    verified: true,
                    password: '',
                    confirmPassword: '',
                })
                setIsVerified(true)
                //console.log(initialDetails)
                console.log('Correct Token')
            }
            else {
                setIsLoading(false)
                console.log('Invalid Verification Code')
                setError('Invalid Verification Code')
            }
        }
    })


    function showVerification(email) {
        return (
            <div>
                <h1>Verify User</h1>
                <form onSubmit={tokenFormik.handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <br />
                    <input
                        type="text"
                        id="email"
                        value={email}
                        disabled
                    />
                    <br />
                    <label htmlFor="token">Verification Code:</label>
                    <br />
                    <input
                        type="text"
                        id="token"
                        onChange={tokenFormik.handleChange}
                        value={tokenFormik.values.token}
                    />
                    <p style={{ color: "red" }}> {tokenFormik.errors.token}</p>
                    <br />
                    <button type="submit">Verify</button>
                    <p>{error}</p>
                </form>
            </div>
        )
    }

    const detailsSchema = yup.object({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        password: yup.string().required('Password is required'),
        confirmPassword: yup.string().required('Confirm Password is required').oneOf([yup.ref('password'), null], 'Passwords must match')
    })

    const detailsFormik = useFormik({
        enableReinitialize: true,
        initialValues: initialDetails,
        validationSchema: detailsSchema,
        onSubmit: (values) => {
            console.log(values)
            fetch(`/users/${params.userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            })
            .then((res) => res.json())
            .then((data) => {
                //setNewUser(data)
                //setRefreshPage(!refreshPage)
                console.log(data)
                setIsLoading(true)
                navigate(`/`)
            })
    }
    })

    function showDetailsForm(email) {
        return (
            <div>
                <h1>Verified!</h1>
                <p>Please enter your details to finish creating your account.</p>
                <form onSubmit={detailsFormik.handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <br />
                    <input
                        type="text"
                        id="email"
                        value={email}
                        disabled
                    />
                    <br />
                    <br />
                    <label htmlFor="firstName">First Name:</label>
                    <br />
                    <input
                        type="text"
                        id="firstName"
                        onChange={detailsFormik.handleChange}
                        value={detailsFormik.values.firstName}
                    />
                    <p style={{ color: "red" }}> {detailsFormik.errors.firstName}</p>
                    <br />
                    <label htmlFor="lastName">Last Name:</label>
                    <br />
                    <input
                        type="text"
                        id="lastName"
                        onChange={detailsFormik.handleChange}
                        value={detailsFormik.values.lastName}
                    />
                    <p style={{ color: "red" }}> {detailsFormik.errors.lastName}</p>
                    <br />
                    <label htmlFor="password">Password:</label>
                    <br />
                    <input
                        type="password"
                        id="password"
                        onChange={detailsFormik.handleChange}
                        value={detailsFormik.values.password}
                    />
                    <p style={{ color: "red" }}> {detailsFormik.errors.password}</p>
                    <br /><label htmlFor="confirmPassword">Confirm Password:</label>
                    <br />
                    <input
                        type="password"
                        id="confirmPassword"
                        onChange={detailsFormik.handleChange}
                        value={detailsFormik.values.confirmPassword}
                    />
                    <p style={{ color: "red" }}> {detailsFormik.errors.confirmPassword}</p>
                    <br />
                    <button type="submit">Verify</button>
                </form>
            </div>
        )
        
    }

    if (isLoading) { return <p>Loading...</p> }
    if(newUser) {
        if (newUser){
            if(newUser.verified) {
                return (
                    <div>
                        <p>User already verified.</p>
                    </div>
                )
            }
            return (
                <div>
                    {isVerified ? showDetailsForm(newUser.email) : showVerification(newUser.email)}
                </div>
            )
        }
        return (
            <div>
                <p>User not Found.</p>
            </div>
        )
    }
    return (
        <div>
            <p>User not found.</p>
        </div>
    )
}

export default Verify;