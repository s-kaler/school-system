import { useUserContext } from "../components/UserContext";
import LoginForm from "../components/LoginForm";
import "../styles/Login.css"

function Login( ) {
    const { setUser} = useUserContext();

    return (
        <LoginForm setUser={setUser}/>
    );
}

export default Login;
