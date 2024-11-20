import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function Home() {
    
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <p>
                You can access other pages by clicking on the navigation links below.
            </p>
            <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
        </div>
    )

}