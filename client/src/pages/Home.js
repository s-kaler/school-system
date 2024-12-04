import Courses from "../components/Courses.js"
import "../styles/Home.css";

function Home() {
    
    return (
        <div className="home-div">
            <h1>Fake School</h1>
            <p>
                This is about the school.
            </p>
            <Courses />
        </div>
    )

}

export default Home;