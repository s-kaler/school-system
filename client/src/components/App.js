import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom"
import NavBar from "./NavBar";
import "../styles/App.css"
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NewStudent from '../pages/NewStudent';
import NewCourse from '../pages/NewCourse';
import NewTeacher from '../pages/NewTeacher';
import Verify from '../pages/Verify';
import CoursePage from '../pages/CoursePage';
import NewAssignment from '../pages/NewAssignment';
import AssignmentPage from '../pages/AssignmentPage';
//import Teachers from '../pages/Teachers';
import { useUserContext } from "./UserContext";


function App() {
    const { user, setUser } = useUserContext();
    useEffect(() => {
        fetch("/check_session").then((response) => {
            if (response.ok) {
                response.json().then((user) => setUser(user));
            }
            else {
                setUser(null);
            }
        });
    }, [setUser]);


    return <div>
        <main>
            <NavBar user={user} setUser={setUser}/>
            <div className="body-div">
                <Routes>
                    <Route path="/*" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/courses/">
                        <Route path="/courses/new" element={<NewCourse />} />
                        <Route path="/courses/:courseId" element={<CoursePage />} />
                        <Route path="/courses/:courseId/newassignment" element={<NewAssignment />} />
                    </Route>
                   
                    <Route path="/teachers/new" element={<NewTeacher />} />
                    <Route path="/students/new" element={<NewStudent />} />
                    <Route path="/verify/:userId" element={<Verify />} />
                    <Route path="/assignments/:assignmentId" element={<AssignmentPage />} />
                </Routes>
            </div>
        </main>
    </div>
}

export default App;