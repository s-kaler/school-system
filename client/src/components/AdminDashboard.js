import {useState, useEffect} from 'react';
import {Outlet, Link} from'react-router-dom';

function AdminDashboard({admin})  {
    const [managedComponent,  setManagedComponent] = useState('')

    function handleManagedComponent(manageType) {
        // Call the appropriate API endpoint to manage the courses, teachers, or students
        // Update the managedComponent state with the returned data
        // Example: fetch(`/admin/manage/${manageType}`)
        //          .then(response => response.json())
        //          .then(data => setManagedComponent(data))
    }
    return (
        <div>
            <h2>Admin Controls</h2>
            <div>
                <Link>Manage Courses</Link>
            </div>
            <br />
            <div>
                <Link>Manage Teachers</Link>
            </div>
            <br />
            <div>
                <Link>Manage Students</Link>
            </div>
            <br />
            <div>

            </div>
        </div>
    )
}

export default AdminDashboard;