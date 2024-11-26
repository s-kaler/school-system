import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function Home() {
    
    return (
        <div>
            <h1>Fake School</h1>
            <p>
                This is about the school.
            </p>
            <ul>
                <li><Link to="/departments/">Departments</Link></li>
                <li><Link to="/courses">Courses</Link></li>
                <li><Link to="/teachers">Teachers</Link></li>
            </ul>
        </div>
    )

}

export default Home;