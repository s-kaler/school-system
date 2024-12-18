import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import "../styles/NewModel.css"
import { useUserContext } from '../components/UserContext';


function NewCourse() {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [refreshPage, setRefreshPage] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUserContext();


    useEffect(() => {
        fetch("/teachers")
        .then((res) => res.json())
        .then((data) => {setTeachers(data)})

        fetch("/departments")
        .then((res) => {
            //console.log(res)
            if (res.ok) {
                res.json().then((data) => {
                    setDepartments(data)
                    setIsLoading(false)
                })
            }
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
        description: yup.string(),
        teacherId: yup.number().min(1, 'Please choose a teacher'),
        departmentId: yup.number().min(1, 'Please choose a department')
    })


    const formik = useFormik({
        initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log(values)
            fetch("/courses", {
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

    if(isLoading) {
        return <p>Loading...</p>
    }

    if(!user || user.user_type !== 'admin') {
        return <p>Unauthorized.</p>
    }
    return (
        <div className="new-model-div">
            <h1>Create New Course</h1>
            <form onSubmit={formik.handleSubmit} className="new-model-form">
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


                <label htmlFor="teachers">Select Teacher</label>
                <br />
                <select 
                    name="teachers" 
                    value={formik.values.teacherId}
                    onChange={(selectedTeacher) => {
                        formik.setFieldValue("teacherId", selectedTeacher.target.value)
                    }}
                >
                    <option value={0}>Select Teacher</option>  {/* Default option for select */}
                    {teacherOptions}
                    
                </select>
                <br />
                <p style={{ color: "red" }}> {formik.errors.teacherId}</p>
                <br />

                {isSubmitted ? <button className="new-model-btn" disabled={true}>Submitted</button> : <button className="new-model-btn" type="submit">Submit</button>}

            </form>
            <p>{error}</p>
            {isSubmitted ? <p></p> : null}
        </div>
    );

}

export default NewCourse;