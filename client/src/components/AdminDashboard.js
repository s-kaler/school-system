import {useState, useEffect} from 'react';
import {Link} from'react-router-dom';
import ManageCourses from './ManageCourses';
import ManageTeachers from './ManageTeachers';
import ManageStudents from './ManageStudents';
import ManageEnrollments from './ManageEnrollments';

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
        managedComponent = <ManageTeachers />
    }
    else if(managedType ==='students') {
        managedComponent = <ManageStudents />
    }
    else if (managedType === 'enrollments') {
        managedComponent = <ManageEnrollments />
    }
    else {
        managedComponent = null
    }
    

    return (
        <div className="control-buttons">
            <h2>Admin Controls</h2>
            <button className="ctrl-btn" onClick={() => handleManagedComponent('courses')}>Manage Courses</button>
            <button className="ctrl-btn" onClick={() => handleManagedComponent('teachers')}>Manage Teachers</button>
            <button className="ctrl-btn" onClick={() => handleManagedComponent('students')}>Manage Students</button>
            <button className="ctrl-btn" onClick={() => handleManagedComponent('enrollments')}>Approve Enrollments</button>
            {
                managedComponent
            }
        </div>
    )
}

export default AdminDashboard;