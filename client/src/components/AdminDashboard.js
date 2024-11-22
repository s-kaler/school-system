import {useState, useEffect} from 'react';
import {Outlet, Link} from'react-router-dom';
import ManageCourses from './ManageCourses';
import ManageTeachers from './ManageTeachers';
import ManageStudents from './ManageStudents';

function AdminDashboard({admin})  {
    const [managedType,  setManagedType] = useState('')

    function handleManagedComponent(linkType) {
        if(linkType === managedType) {
            setManagedType('')
        }
        else {
            setManagedType(linkType)
        }
    }

    let managedComponent = null
    if(managedType === 'courses') {
        managedComponent = <ManageCourses />
    }
    else if(managedType === 'teachers') {
        //return <Outlet name='teachers' />
        managedComponent = <ManageTeachers />
    }
    else if(managedType ==='students') {
        //return <Outlet name='students' />
        managedComponent = <ManageStudents />
    }
    else {
        managedComponent = null
    }
    

    return (
        <div>
            <h2>Admin Controls</h2>
            <div>
                <button onClick={() => handleManagedComponent('courses')}>Manage Courses</button>
            </div>
            <br />
            <div>
                <button onClick={() => handleManagedComponent('teachers')}>Manage Teachers</button>
            </div>
            <br />
            <div>
                <button onClick={() => handleManagedComponent('students')}>Manage Students</button>
            </div>
            <br />
            {
                managedComponent
            }
        </div>
    )
}

export default AdminDashboard;