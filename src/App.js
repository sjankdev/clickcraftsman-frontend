import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardAdmin from "./components/BoardAdmin";
import BoardFreelancer from "./components/BoardFreelancer";
import OpenProjectsForFreelancers from "./components/OpenProjectsForFreelancers";
import ClientReceivedApplications from "./components/ClientReceivedApplications.js";
import ClientPostedJobs from "./components/ClientPostedJobs";
import ClientJobApplicants from "./components/ClientJobApplicants";
import FreelancerPublicProfiles from "./components/FreelancerPublicProfiles";
import PublicProfileDetail from "./components/PublicProfileDetail";
import UserProfile from "./components/UserProfile";

import { logout } from "./slices/auth";

import EventBus from "./common/EventBus";

const App = () => {
  const [showFreelancerPublicProfilesBoard, setFreelancerPublicProfilesBoard] =
    useState(false);
  const [showUserProfileBoard, setUserProfileBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showUserBoard, setUserBoard] = useState(false);
  const [showFreelancerBoard, setShowFreelancerBoard] = useState(false);
  const [
    showOpenProjectsForFreelancersBoard,
    setOpenProjectsForFreelancersBoard,
  ] = useState(false);
  const [showClientReceivedApplicationsBoard, setClientReceivedApplications] =
    useState(false);
  const [showClientPostedJobsBoard, setClientPostedJobsBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowFreelancerBoard(currentUser.roles.includes("ROLE_FREELANCER"));
      setOpenProjectsForFreelancersBoard(
        currentUser.roles.includes("ROLE_FREELANCER")
      );
      setFreelancerPublicProfilesBoard(
        currentUser.roles.includes("ROLE_CLIENT")
      );
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
      setUserBoard(currentUser.roles.includes("ROLE_CLIENT"));
      setClientPostedJobsBoard(currentUser.roles.includes("ROLE_CLIENT"));
      setClientReceivedApplications(currentUser.roles.includes("ROLE_CLIENT"));
      setUserProfileBoard(currentUser.roles.includes("ROLE_CLIENT") || currentUser.roles.includes("ROLE_FREELANCER"));
    } else {
      setFreelancerPublicProfilesBoard(false);
      setShowAdminBoard(false);
      setUserBoard(false);
      setShowFreelancerBoard(false);
      setOpenProjectsForFreelancersBoard(false);
      setClientReceivedApplications(false);
      setUserProfileBoard(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            ClickCraftsman
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showFreelancerBoard && (
              <li className="nav-item">
                <Link to={"/freelancer"} className="nav-link">
                  Freelancer
                </Link>
              </li>
            )}

            {showUserProfileBoard && (
              <li className="nav-item">
                <Link to={"/my-profile"} className="nav-link">
                  My profile
                </Link>
              </li>
            )}

            {showOpenProjectsForFreelancersBoard && (
              <li className="nav-item">
                <Link to={"/projects"} className="nav-link">
                  Projects
                </Link>
              </li>
            )}
            {showFreelancerPublicProfilesBoard && (
              <li className="nav-item">
                <Link to={"/public-profiles"} className="nav-link">
                  Freelancers
                </Link>
              </li>
            )}

            {showClientPostedJobsBoard && (
              <li className="nav-item">
                <Link to={"/client-projects"} className="nav-link">
                  Projects
                </Link>
              </li>
            )}

            {showClientReceivedApplicationsBoard && (
              <li className="nav-item">
                <Link to={"/client-received-applications"} className="nav-link">
                  Received applications
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {showUserBoard && (
              <li className="nav-item">
                <Link to={"/client"} className="nav-link">
                  Post a job
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/client" element={<BoardUser />} />
            <Route path="/freelancer" element={<BoardFreelancer />} />
            <Route path="/projects" element={<OpenProjectsForFreelancers />} />
            <Route
              path="/client-received-applications"
              element={<ClientReceivedApplications />}
            />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/client-projects" element={<ClientPostedJobs />} />
            <Route
              path="/client/job/:jobId"
              element={<ClientJobApplicants />}
            />
            <Route
              path="/public-profiles"
              element={<FreelancerPublicProfiles />}
            />
            <Route
              path="/public-profile/:freelancerId"
              element={<PublicProfileDetail />}
            />
            <Route path="/my-profile" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
