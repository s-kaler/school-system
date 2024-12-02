import { NavLink, Navigate, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar({ user, setUser }) {
    const navigate = useNavigate();
    //creating link to user's profile page
    
    function handleLoginClick() {
        navigate("/login");
    }

    function handleLogoutClick() {
        fetch("/logout", { method: "DELETE" }).then((r) => {
            if (r.ok) {
                setUser(null);
                navigate("/");
            }
        });
    }

    function userLinks(user) {
        if (user) {
            if (user.user_type === "admin") {
                //add link to admin dashboard if user is admin
                return (
                    <>
                        <NavLink to="/dashboard" className="nav-link">Admin Dashboard</NavLink>
                    </>
                )
            }
            else if (user.user_type === "teacher") {
                //add link to teacher dashboard if user is teacher
                return (
                    <>
                        <NavLink to="/dashboard" className="nav-link">Teacher Dashboard</NavLink>
                    </>
                )
            }
            else if (user.user_type === "student") {
                //add link to student dashboard if user is student
                return (
                    <>
                        <NavLink to="/dashboard" className="nav-link">Student Dashboard</NavLink>
                    </>
                )
            }
        }
        else {
            return (
                <>
                </>
            )
        }
    }
    
    //navigation bar includes links to homepage, 
    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-link">Home</NavLink>
            {" "}
            {userLinks(user)}
            {" "}
            {user ?
                <button onClick={handleLogoutClick} className="logging">Log Out</button> :
                <button onClick={handleLoginClick} className="logging">Log In</button>
            }
        </nav>
    )
}

export default NavBar;