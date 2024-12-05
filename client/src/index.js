import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes"
import './index.css';
import { UserProvider } from "./components/UserContext";
import App from './components/App'

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

    <UserProvider>
        <RouterProvider router={router}>
        </RouterProvider>
    </UserProvider>
)

