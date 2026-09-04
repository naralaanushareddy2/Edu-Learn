import React, { useState } from "react";
import "../styles/login.css";
import axios from "axios";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import { useDispatch } from "react-redux";

import {
    loginUser as loginUserAction
} from "../redux/authSlice";


const Login = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();


    // =====================================================
    // CHECK CURRENT PAGE
    // =====================================================

    const isRegisterPage =
        location.pathname === "/Register";


    // =====================================================
    // STATES
    // =====================================================

    const [role, setRole] =
        useState("student");

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [dob, setDob] =
        useState("");

    const [gender, setGender] =
        useState("");

    const [country, setCountry] =
        useState("");


    // =====================================================
    // JSON SERVER URL
    // =====================================================

    const url =
        "http://localhost:5000/users";


    // =====================================================
    // LOGIN FUNCTION
    // =====================================================
const loginUser = async (e) => {
    e.preventDefault();

    try {
        // Get users from JSON Server
        const response = await axios.get(url);
        const users = response.data;

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Find matching user
        const user = users.find(
            (item) =>
                item.email &&
                item.email.toLowerCase() === normalizedEmail &&
                item.password === password &&
                item.role === role
        );

        // Login success
        if (user) {

            // Check if account is locked
            if (user.locked == true) {
                alert(
                    "Your account has been locked by the administrator. Please contact support."
                );
                return;
            }

            // Store logged-in user in Redux
            dispatch(loginUserAction(user));

            // Success message
            if (user.role === "admin") {
                alert("Administrator Login Successful");
            } else {
                alert("Student Login Successful");
            }

            // Go to home page
            navigate("/");

        } else {

            // Login failed
            alert("Invalid Email, Password, or Account Type");
        }

    } catch (error) {

        console.error("Login Error:", error);

        alert(
            "Unable to connect to the server. Make sure JSON Server is running."
        );
    }
};
   

    // =====================================================
    // REGISTER FUNCTION
    // =====================================================

    const registerUser = async (e) => {

        e.preventDefault();


        const normalizedEmail =
            email.trim().toLowerCase();


        // =================================================
        // PASSWORD VALIDATION
        // =================================================

        if (
            password !==
            confirmPassword
        ) {

            alert(
                "Passwords do not match"
            );

            return;

        }


        try {

            // =================================================
            // GET USERS
            // =================================================

            const response =
                await axios.get(url);

            const users =
                response.data;


            // =================================================
            // CHECK EXISTING EMAIL
            // =================================================

            const existingUser =
                users.find(
                    (user) =>
                        user.email
                            .toLowerCase() ===
                            normalizedEmail
                );


            if (existingUser) {

                alert(
                    "Email is already registered"
                );

                return;

            }


            // =================================================
            // CREATE USER
            // =================================================

            const userData = {

                name: name,

                email: normalizedEmail,

                password: password,

                dob: dob,

                gender: gender,

                country: country,

                role: role,

                profileImage: ""

            };


            // =================================================
            // SAVE USER TO JSON SERVER
            // =================================================

            const registerResponse =
                await axios.post(
                    url,
                    userData
                );


            // =================================================
            // SUCCESS MESSAGE
            // =================================================

            alert(
                role === "admin"
                    ? "Administrator Registration Successful"
                    : "Student Registration Successful"
            );


            // =================================================
            // CLEAR FORM
            // =================================================

            setName("");

            setEmail("");

            setPassword("");

            setConfirmPassword("");

            setDob("");

            setGender("");

            setCountry("");

            setRole("student");


            // =================================================
            // GO TO LOGIN
            // =================================================

            navigate("/Login");


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            alert(
                "Registration failed. Make sure JSON Server is running."
            );

        }

    };


    // =====================================================
    // LOGIN PAGE
    // =====================================================

    if (!isRegisterPage) {

        return (

            <div className="login-page">

                <div className="login-container">

                    <h1>
                        Login Form
                    </h1>


                    <form
                        className="login-form"
                        onSubmit={loginUser}
                    >


                        {/* ACCOUNT TYPE */}

                        <label>
                            Login As
                        </label>


                        <div className="role-options">

                            <label>

                                <input
                                    type="radio"
                                    name="loginRole"
                                    value="student"
                                    checked={
                                        role ===
                                        "student"
                                    }
                                    onChange={(e) =>
                                        setRole(
                                            e.target.value
                                        )
                                    }
                                />

                                Student

                            </label>


                            <label>

                                <input
                                    type="radio"
                                    name="loginRole"
                                    value="admin"
                                    checked={
                                        role ===
                                        "admin"
                                    }
                                    onChange={(e) =>
                                        setRole(
                                            e.target.value
                                        )
                                    }
                                />

                                Administrator

                            </label>

                        </div>


                        {/* EMAIL */}

                        <label>
                            Email
                        </label>


                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                        .toLowerCase()
                                )
                            }
                            placeholder="Enter your email"
                            required
                        />


                        {/* PASSWORD */}

                        <label>
                            Password
                        </label>


                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your password"
                            required
                        />


                        {/* LOGIN BUTTON */}

                        <button type="submit">
                            Login
                        </button>


                    </form>


                    {/* REGISTER LINK */}

                    <p className="account-link">

                        Don't have an account?

                        <Link to="/Register">
                            Register
                        </Link>

                    </p>


                </div>

            </div>

        );

    }


    // =====================================================
    // REGISTER PAGE
    // =====================================================

    return (

        <div className="login-page">

            <div className="login-container register-container">

                <h1>
                    Create Account
                </h1>


                <form
                    className="login-form"
                    onSubmit={registerUser}
                >


                    {/* ACCOUNT TYPE */}

                    <label>
                        Register As
                    </label>


                    <div className="role-options">

                        <label>

                            <input
                                type="radio"
                                name="registerRole"
                                value="student"
                                checked={
                                    role ===
                                    "student"
                                }
                                onChange={(e) =>
                                    setRole(
                                        e.target.value
                                    )
                                }
                            />

                            Student

                        </label>


                        <label>

                            <input
                                type="radio"
                                name="registerRole"
                                value="admin"
                                checked={
                                    role ===
                                    "admin"
                                }
                                onChange={(e) =>
                                    setRole(
                                        e.target.value
                                    )
                                }
                            />

                            Administrator

                        </label>

                    </div>


                    {/* NAME */}

                    <label>
                        Name
                    </label>


                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        placeholder="Enter your name"
                        required
                    />


                    {/* EMAIL */}

                    <label>
                        Email
                    </label>


                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                                    .toLowerCase()
                            )
                        }
                        placeholder="Enter your email"
                        required
                    />


                    {/* PASSWORD */}

                    <label>
                        Password
                    </label>


                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        placeholder="Create password"
                        required
                    />


                    {/* CONFIRM PASSWORD */}

                    <label>
                        Confirm Password
                    </label>


                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
                        placeholder="Confirm password"
                        required
                    />


                    {/* DOB */}

                    <label>
                        Date of Birth
                    </label>


                    <input
                        type="date"
                        value={dob}
                        onChange={(e) =>
                            setDob(
                                e.target.value
                            )
                        }
                        required
                    />


                    {/* GENDER */}

                    <label>
                        Gender
                    </label>


                    <select
                        value={gender}
                        onChange={(e) =>
                            setGender(
                                e.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Select Gender
                        </option>

                        <option value="Male">
                            Male
                        </option>

                        <option value="Female">
                            Female
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>


                    {/* STATE */}

                    <label>
                        State
                    </label>


                    <select
                        value={country}
                        onChange={(e) =>
                            setCountry(
                                e.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Select State
                        </option>

                        <option value="Andhra Pradesh">
                            Andhra Pradesh
                        </option>

                        <option value="Telangana">
                            Telangana
                        </option>

                        <option value="Tamil Nadu">
                            Tamil Nadu
                        </option>

                        <option value="Kerala">
                            Kerala
                        </option>

                        <option value="Karnataka">
                            Karnataka
                        </option>

                    </select>


                    {/* REGISTER */}

                    <button type="submit">
                        Register
                    </button>


                </form>


                {/* LOGIN LINK */}

                <p className="account-link">

                    Already have an account?

                    <Link to="/Login">
                        Login
                    </Link>

                </p>


            </div>

        </div>

    );

};


export default Login;