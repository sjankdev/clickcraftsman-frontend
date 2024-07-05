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
  const [showMenu, setShowMenu] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [logOut]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLinkClick = () => {
    setShowMenu(false);
  };

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link to={"/"} className="navbar-brand">
              ClickCraftsman
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleMenu}
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className={`collapse navbar-collapse ${showMenu ? "show" : ""}`}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link
                    to={"/home"}
                    className="nav-link"
                    onClick={handleLinkClick}
                  >
                    Home
                  </Link>
                </li>
                {currentUser &&
                  currentUser.roles.includes("ROLE_FREELANCER") && (
                    <li className="nav-item">
                      <Link
                        to={"/freelancer/my-profile"}
                        className="nav-link"
                        onClick={handleLinkClick}
                      >
                        My profile
                      </Link>
                    </li>
                  )}

                {currentUser && currentUser.roles.includes("ROLE_CLIENT") && (
                  <li className="nav-item">
                    <Link
                      to={"/client/my-profile"}
                      className="nav-link"
                      onClick={handleLinkClick}
                    >
                      My profile
                    </Link>
                  </li>
                )}

                {currentUser &&
                  currentUser.roles.includes("ROLE_FREELANCER") && (
                    <li className="nav-item">
                      <Link
                        to={"/projects"}
                        className="nav-link"
                        onClick={handleLinkClick}
                      >
                        Projects
                      </Link>
                    </li>
                  )}
                {currentUser && currentUser.roles.includes("ROLE_CLIENT") && (
                  <li className="nav-item">
                    <Link
                      to={"/client/freelancer-public-profiles"}
                      className="nav-link"
                      onClick={handleLinkClick}
                    >
                      Freelancers
                    </Link>
                  </li>
                )}

                {currentUser && currentUser.roles.includes("ROLE_CLIENT") && (
                  <li className="nav-item">
                    <Link
                      to={"/client/projects"}
                      className="nav-link"
                      onClick={handleLinkClick}
                    >
                      Projects
                    </Link>
                  </li>
                )}

                {currentUser && currentUser.roles.includes("ROLE_CLIENT") && (
                  <li className="nav-item">
                    <Link
                      to={"/client/received-applications"}
                      className="nav-link"
                      onClick={handleLinkClick}
                    >
                      Received applications
                    </Link>
                  </li>
                )}

                {currentUser && currentUser.roles.includes("ROLE_ADMIN") && (
                  <li className="nav-item">
                    <Link
                      to={"/admin"}
                      className="nav-link"
                      onClick={handleLinkClick}
                    >
                      Admin Board
                    </Link>
                  </li>
                )}

                {currentUser && currentUser.roles.includes("ROLE_CLIENT") && (
                  <li className="nav-item">
                    <Link
                      to={"/client/post-job"}
                      className="nav-link"
                      onClick={handleLinkClick}
                    >
                      Post a job
                    </Link>
                  </li>
                )}
              </ul>

              {currentUser ? (
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/"} className="nav-link">
                      {currentUser.username}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link" onClick={logOut}>
                      LogOut
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link
                      to={"/login"}
                      className="nav-link"
                      onClick={handleLinkClick}
                    >
                      Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to={"/register"}
                      className="nav-link"
                      onClick={handleLinkClick}
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
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
