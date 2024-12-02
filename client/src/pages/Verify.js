import { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import {Formik, useFormik} from 'formik'
import * as yup from 'yup'
import "../styles/Verify.css"

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
                    //console.log(data)
                    if (!data.verified) {
                        setUser(null)
                    }
                    setNewUser(data)
                    setInitialDetails({
                        firstName: data['first_name'],
                        lastName: data['last_name'],
                        verified: true,
                        password: '',
                        confirmPassword: '',
                    })
                    setIsLoading(false)
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
                //console.log('Invalid Verification Code')
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
        confirmPassword: yup.string().required('Confirm your password').oneOf([yup.ref('password'), null], 'Passwords must match')
    })

    const detailsFormik = useFormik({
        enableReinitialize: true,
        initialValues: initialDetails,
        validationSchema: detailsSchema,
        onSubmit: (values) => {
            //console.log(values)
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
                //console.log(data)
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
                    <p>User already verified.</p>
                )
            }
            return (
                <div className="verification-div">
                    {isVerified ? showDetailsForm(newUser.email) : showVerification(newUser.email)}
                </div>
            )
        }
        return (
            <p>User not Found.</p>
        )
    }
    return (
        <p>User not found.</p>
    )
}

export default Verify;