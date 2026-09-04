import React from "react";

import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import Nav from "./src/components/Nav";
import BottomNav from "./src/components/BottomNav";

import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import Categories from "./src/pages/Categories";
import Subcategories from "./src/pages/Subcategories";
import CourseDetails from "./src/pages/CourseDetails";
import Courses from "./src/pages/Courses";
import Instructors from "./src/pages/Instructors";
import Learning from "./src/pages/Learning";
import MyLearning from "./src/pages/MyLearning";
import Wishlist from "./src/pages/Wishlist";
import Certificate from "./src/pages/Certificate";
import Profile from "./src/pages/Profile";

import AdminDashboard from "./src/admin/AdminDashboard";
import AdminLearning from "./src/admin/AdminLearning";

import HelpSupport from "./src/pages/HelpSupport";
import TermsConditions from "./src/pages/TermsConditions";

import ProtectedRoute from "./src/components/ProtectedRoute";


const Allroutes = () => {

  return (

    <BrowserRouter>

      <Nav />

      <Routes>


        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/Login"
          element={<Login />}
        />

        <Route
          path="/Register"
          element={<Login />}
        />

        <Route
          path="/HelpSupport"
          element={<HelpSupport />}
        />

        <Route
          path="/TermsConditions"
          element={<TermsConditions />}
        />

        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/categories/:categoryId"
          element={<Subcategories />}
        />

        <Route
          path="/Courses"
          element={<Courses />}
        />

        <Route
          path="/Courses/:subcategoryId"
          element={<CourseDetails />}
        />

        <Route
          path="/Instructors"
          element={<Instructors />}
        />

        <Route
          path="/Learning"
          element={<Learning />}
        />


        {/* =================================================
            PROTECTED USER ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/my-learning"
            element={<MyLearning />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/certificate/:courseId"
            element={<Certificate />}
          />

        </Route>


        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/AdminLearning"
            element={<AdminLearning />}
          />

        </Route>


      </Routes>


      <BottomNav />

    </BrowserRouter>

  );

};


export default Allroutes;