import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function Login({ setUser }) {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <>
            <LoginForm setUser={setUser}/>
        </>
    );
}

export default Login;
