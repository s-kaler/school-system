import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

function NewCourse() {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [refreshPage, setRefreshPage] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const initialValues = {
        name: '',
        credits: 0,
        description: '',
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

    /*
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            try {
                await fetch('/courses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                })
                navigate('/courses')
            } catch (error) {
                setError('Error creating new course')
            } finally {
                setIsLoading(false)
            }
        }
    })
    */


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
                        navigate("/courses");
                    }, 500);

                }
                else if (res.status == 422) {
                    console.log(res.error);
                }
            });
        },
    });


    return (
        <div>
            <h1>Sign Up</h1>
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
                <input
                    id="description"
                    name="description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />
                <p style={{ color: "red" }}> {formik.errors.description}</p>
                <br />

                

                {isSubmitted ? <button disabled={true}>Submitted</button> : <button type="submit">Submit</button>}

            </form>
            <p>{error}</p>
            {isSubmitted ? <p></p> : null}
        </div>
    );

}

export default NewCourse;