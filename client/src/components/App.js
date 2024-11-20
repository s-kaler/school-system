import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom"
import Login from "../pages/Login";
import NavBar from "./NavBar";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("/check_session").then((response) => {
            if (response.ok) {
                response.json().then((user) => setUser(user));
            }
            else {
                setUser(null);
            }
        });
    }, []);

    function handleLogin(user) {
        setUser(user);
    }

    function handleLogout() {
        setUser(null);
    }
    
    return <div>
        <main>
            <NavBar setUser={setUser}/>
            <Outlet context={[user, setUser]} />
        </main>
    </div>
}

export default App;