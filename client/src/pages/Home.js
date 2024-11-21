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
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
        </div>
    )

}

export default Home;