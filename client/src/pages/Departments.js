import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Departments() {
    const [departments, setDepartments] = useState([])
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
        fetch('/departments')
           .then(response => response.json())
           .then((data) => {
                setDepartments(data)
                setLoading(false)
            })
    }, [])

    const departmentList = departments.map((department) => (
        <li key={department.id}>
            <Link to={`/departments/${department.id}`}>{department.name}</Link>
        </li>
    ))
    if (isLoading) {
        return <p>Loading...</p>
    }
    return (
        <div>
            <h1>Departments</h1>
            <ul>
                {departmentList}
            </ul>
        </div>
    )
}

export default Departments;