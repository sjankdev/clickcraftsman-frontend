import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

import ClientPostJob from "./components/client/ClientPostJob.js";
import ClientReceivedApplications from "./components/client/ClientReceivedApplications.js";
import ClientPostedJobs from "./components/client/ClientPostedJobs.js";
import ClientJobApplicants from "./components/client/ClientJobApplicants.js";
import ClientProfile from "./components/client/ClientProfile";

import FreelancerPublicProfiles from "./components/freelancer/FreelancerPublicProfiles";
import FreelancerBoard from "./components/freelancer/FreelancerBoard";
import FreelancerOpenProjects from "./components/freelancer/FreelancerOpenProjects";
import FreelancerProfileDetail from "./components/freelancer/FreelancerProfileDetail";

import FreelancerProfile from "./components/freelancer/FreelancerProfile.js";

import { logout } from "./slices/auth";

import EventBus from "./common/EventBus";

const App = () => {
  const [showFreelancerPublicProfilesBoard, setFreelancerPublicProfilesBoard] =
    useState(false);
  const [showFreelancerProfile, setFreelancerProfile] = useState(false);
  const [showFreelancerProfileDetail, setFreelancerProfileDetail] =
    useState(false);
  const [showUserProfileBoard, setUserProfileBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showUserBoard, setUserBoard] = useState(false);
  const [showFreelancerBoard, setShowFreelancerBoard] = useState(false);
  const [showFreelancerOpenprojectsBoard, setFreelancerOpenProjectsBoard] =
    useState(false);
  const [showClientReceivedApplicationsBoard, setClientReceivedApplications] =
    useState(false);
  const [showClientPostedJobsBoard, setClientPostedJobsBoard] = useState(false);
  const [showClientProfile, setClientProfile] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowFreelancerBoard(currentUser.roles.includes("ROLE_FREELANCER"));
      setFreelancerProfile(currentUser.roles.includes("ROLE_FREELANCER"));
      setFreelancerOpenProjectsBoard(
        currentUser.roles.includes("ROLE_FREELANCER")
      );
      setFreelancerProfileDetail(currentUser.roles.includes("ROLE_CLIENT"));
      setFreelancerPublicProfilesBoard(
        currentUser.roles.includes("ROLE_CLIENT")
      );
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
      setClientProfile(currentUser.roles.includes("ROLE_CLIENT"));
      setUserBoard(currentUser.roles.includes("ROLE_CLIENT"));
      setClientPostedJobsBoard(currentUser.roles.includes("ROLE_CLIENT"));
      setClientReceivedApplications(currentUser.roles.includes("ROLE_CLIENT"));
      setUserProfileBoard(
        currentUser.roles.includes("ROLE_CLIENT") ||
          currentUser.roles.includes("ROLE_FREELANCER")
      );
    } else {
      setFreelancerPublicProfilesBoard(false);
      setFreelancerProfileDetail(false);
      setShowAdminBoard(false);
      setUserBoard(false);
      setShowFreelancerBoard(false);
      setFreelancerOpenProjectsBoard(false);
      setClientReceivedApplications(false);
      setUserProfileBoard(false);
      setFreelancerProfile(false);
      setClientProfile(false);
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
            {showFreelancerProfile && (
              <li className="nav-item">
                <Link to={"/freelancer/my-profile"} className="nav-link">
                  My profile
                </Link>
              </li>
            )}

            {showClientProfile && (
              <li className="nav-item">
                <Link to={"/client/my-profile"} className="nav-link">
                  My profile
                </Link>
              </li>
            )}

            {showFreelancerOpenprojectsBoard && (
              <li className="nav-item">
                <Link to={"/projects"} className="nav-link">
                  Projects
                </Link>
              </li>
            )}
            {showFreelancerProfileDetail && (
              <li className="nav-item">
                <Link
                  to={"/client/freelancer-public-profiles"}
                  className="nav-link"
                >
                  Freelancers
                </Link>
              </li>
            )}

            {showClientPostedJobsBoard && (
              <li className="nav-item">
                <Link to={"/client/projects"} className="nav-link">
                  Projects
                </Link>
              </li>
            )}

            {showClientReceivedApplicationsBoard && (
              <li className="nav-item">
                <Link to={"/client/received-applications"} className="nav-link">
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
                <Link to={"/client/post-job"} className="nav-link">
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

            <Route path="/client/my-profile" element={<ClientProfile />} />
            <Route path="/client/post-job" element={<ClientPostJob />} />
            <Route
              path="/client/received-applications"
              element={<ClientReceivedApplications />}
            />
            <Route path="/client/projects" element={<ClientPostedJobs />} />
            <Route
              path="/client/job/:jobId"
              element={<ClientJobApplicants />}
            />
            <Route
              path="/client/freelancer-public-profiles"
              element={<FreelancerPublicProfiles />}
            />

            <Route path="/freelancer" element={<FreelancerBoard />} />
            <Route path="/projects" element={<FreelancerOpenProjects />} />
            <Route
              path="/public-profile/:freelancerId"
              element={<FreelancerProfileDetail />}
            />

            <Route
              path="/freelancer/my-profile"
              element={<FreelancerProfile />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
