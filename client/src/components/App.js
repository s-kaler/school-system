import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom"
import NavBar from "./NavBar";
import "../styles/App.css"

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


    return <div>
        <main>
            <NavBar user={user} setUser={setUser}/>
            <div className="body-div">
                <Outlet context={[user, setUser]} />
            </div>
        </main>
    </div>
}

export default App;