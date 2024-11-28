import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Courses from "./Courses.js"

function Home() {
    
    return (
        <div>
            <h1>Fake School</h1>
            <p>
                This is about the school.
            </p>
            <Courses />
        </div>
    )

}

export default Home;