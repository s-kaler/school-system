import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../styles/Login.css"

function Login( ) {
    const [user, setUser] = useOutletContext();

    return (
        <LoginForm setUser={setUser}/>
    );
}

export default Login;
