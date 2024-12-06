import { Outlet } from "react-router-dom"
import NavBar from "./NavBar";
import "../styles/App.css"
//import Teachers from '../pages/Teachers';
//import { useUserContext } from "./UserContext";


function App() {
    return <div>
        <main>
            <NavBar/>
            <div className="body-div">
                <Outlet />
            </div>
        </main>
    </div>
}

export default App;