import React, { useEffect } from "react";
import { Outlet } from "react-router-dom"
import NavBar from "./NavBar";
import "../styles/App.css"

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
                <Outlet />
            </div>
        </main>
    </div>
}

export default App;