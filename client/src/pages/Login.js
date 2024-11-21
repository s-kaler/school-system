import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function Login( ) {
    const [showLogin, setShowLogin] = useState(true);
    const [user, setUser] = useOutletContext();

    return (
        <>
            <LoginForm setUser={setUser}/>
        </>
    );
}

export default Login;
