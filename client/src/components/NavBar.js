import { NavLink, Navigate, useNavigate } from "react-router-dom";
import './App.css';

function NavBar({ user }) {
    const navigate = useNavigate();
    //creating link to user's profile page
    
    function handleLoginClick() {
        navigate("/login");
    }

    function handleLogoutClick() {
        fetch("/logout", { method: "DELETE" }).then((r) => {
            if (r.ok) {
                setUser({
                    username: '',
                    id: '',
                });
                navigate("/");
            }
        });
    }

    if (user.user_type === "admin") {
        //add link to admin dashboard if user is admin
        return (
            <>
                <NavLink to="/" className="nav-link">Home</NavLink>
                <NavLink to="/admin" className="nav-link">Admin Dashboard</NavLink>
            </>
        )
    }
    else if (user.user_type === "Teacher") {
        //add link to teacher dashboard if user is teacher
        return (
            <>
                <NavLink to="/" className="nav-link">Home</NavLink>
                <NavLink to="/teacher" className="nav-link">Teacher Dashboard</NavLink>
            </>
        )
    }
    else if (user.user_type === "Student") {
        //add link to student dashboard if user is student
        return (
            <>
                <NavLink to="/" className="nav-link">Home</NavLink>
                <NavLink to="/student" className="nav-link">Student Dashboard</NavLink>
            </>
        )
    }
    else {
        return (
            <>
                <NavLink to="/" className="nav-link">Home</NavLink>
            </>
        )
    }


    //navigation bar includes links to homepage, 
    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-link">Home</NavLink>
            {" "}
            <NavLink to="/search" className="nav-link">Search</NavLink>
            {" "}
            {user.id !== '' ? <NavLink to={profileLink} className="nav-link">My Profile</NavLink> : <></>}
            {user.id !== '' ?
                <button onClick={handleLogoutClick} className="logging">Log Out</button> :
                <button onClick={handleLoginClick} className="logging">Log In</button>}
        </nav>
    )
}

export default NavBar;