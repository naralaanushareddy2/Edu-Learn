import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
    FiHome,
    FiGrid,
    FiBookOpen,
    FiUser,
    FiSettings
} from 'react-icons/fi'

import '../styles/bottomnav.css'
import { useSelector } from 'react-redux'


const BottomNav = () => {

    const location = useLocation()

    // Get logged-in user
    const loggedInUser = 
     useSelector((state) => state.auth.user)  
    
    // Check admin
    const isAdmin = loggedInUser?.role === "admin"


    // Navigation items
    const navItems = [

        {
            name: "Home",
            path: "/",
            icon: <FiHome />
        },

        {
            name: "Categories",
            path: "/categories",
            icon: <FiGrid />
        },

        {
            name: "My Learning",
            path: "/my-learning",
            icon: <FiBookOpen />
        },

        {
            name: "Profile",
            path: "/profile",
            icon: <FiUser />
        }

    ]


    // Admin navigation
    if (isAdmin) {

        navItems.push({

            name: "Admin",
            path: "/admin",
            icon: <FiSettings />

        })

    }


    return (

        <nav className="bottom-nav">

            <div className="bottom-nav-container">

                {navItems.map((item) => (

                    <Link
                        key={item.name}
                        to={item.path}
                        className={
                            location.pathname === item.path
                                ? "bottom-nav-item active"
                                : "bottom-nav-item"
                        }
                    >

                        <span className="bottom-nav-icon">
                            {item.icon}
                        </span>

                        <span className="bottom-nav-text">
                            {item.name}
                        </span>

                    </Link>

                ))}

            </div>

        </nav>

    )

}

export default BottomNav