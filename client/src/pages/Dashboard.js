import React from "react";
import AdminDashboard from "../components/AdminDashboard"
import TeacherDashboard from "../components/TeacherDashboard"
import StudentDashboard from "../components/StudentDashboard"
import "../styles/Dashboard.css"
import { useUserContext } from '../components/UserContext';

function Dashboard() {
    const { user } = useUserContext();
    //console.log(user)
    let userDashboard = null
    if (user) {
        if (user.user_type === "admin") {
            userDashboard = <AdminDashboard admin={user} />
        }
        else if (user.user_type === "teacher") {
            userDashboard = <TeacherDashboard teacher={user} />
        }
        else if (user.user_type === "student") {
            userDashboard = <StudentDashboard student={user} />
        }
    }
    else {
        return (<p>Please login to access your dashboard.</p>)
    }

    return (
        <div className="dashboard-container">
            <div className="greeting">
                <h1>My Dashboard</h1>
                <p>
                    Welcome, {user.first_name} {user.last_name}
                </p>
            </div>
            {userDashboard}
        </div>
    )
}

export default Dashboard;