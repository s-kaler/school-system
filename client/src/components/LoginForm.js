import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function LoginForm({ onLogin, setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }).then((r) => {
            if (r.ok) {
                setError(null);
                const interval = setTimeout(() => {
                    r.json().then((user) => setUser(user));
                    setIsLoading(false);
                    navigate("/");
                }, 500);
            } else {
                setIsLoading(false);
                setError("Invalid credentials")
            }
        });
    }

    return (
        <div className="login-form">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email Address</label>
                <br />
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <br />
                <label htmlFor="password">Password</label>
                <br />
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <br />
                <button type="submit">
                    {isLoading ? "Loading..." : "Login"}
                </button>
                <p>{error}</p>
            </form>
            <br></br>
        </div>

    );
}

export default LoginForm;