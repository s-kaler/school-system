import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {Formik, useFormik} from 'formik'
import * as yup from 'yup'

function Verify(){
    const params = useParams()
    const [user, setUser] = useState(null);
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

    useEffect(() => {
        setIsLoading(true)
        fetch(`/users/${params.userId}`)
           .then((response) => response.json())
           .then((data) => {
               setUser(data)
               setInitialDetails({
                   firstName: user['first_name'],
                   lastName: user['last_name'],
                   verified: true,
                   password: '',
                   confirmPassword: '',
               })
                setIsLoading(false)
                console.log(data)
            })
           .catch((error) => {
                setError(error.message)
                setIsLoading(false)
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
            if (values.token === user['verification_code']) {
                //setIsLoading(true)
                setInitialDetails({
                    firstName: user['first_name'],
                    lastName: user['last_name'],
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
                //setUser(data)
                //setRefreshPage(!refreshPage)
                console.log(data)
                setIsLoading(true)
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
    else {
        if (user){
            return (
                <div>
                    {isVerified ? showDetailsForm(user.email) : showVerification(user.email)}
                </div>
            )
        }
        return (
            <div>
                <p>User not Found.</p>
            </div>
        )
    }
}

export default Verify;