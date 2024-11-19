import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom"

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("/check_session").then((response) => {
            if (response.ok) {
                response.json().then((user) => setUser(user));
            }
            else {

            }
        });
    }, []);

    function handleLogin(user) {
        setUser(user);
    }

    function handleLogout() {
        setUser(null);
    }

    if (!user) return <Login onLogin={setUser} />;
    
    return <div>
        <main>

        </main>
    </div>
}

export default App;