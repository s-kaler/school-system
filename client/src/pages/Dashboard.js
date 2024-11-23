import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard"

function Dashboard() {
    const [user, setUser] = useOutletContext();
    //console.log(user)
    let userDashboard = null
    if (user) {
        if (user.user_type === "admin") {
            userDashboard = <AdminDashboard admin={user} />
        }
    }
    else {
        return (<p>Please login to access your dashboard.</p>)
    }

    return (
        <div>
            <h1>My Dashboard</h1>
            <p>
                Welcome, {user.first_name} {user.last_name}
            </p>
            {userDashboard}
        </div>
    )
}

export default Dashboard;