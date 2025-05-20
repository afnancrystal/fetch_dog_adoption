import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import LoginPage from "./pages/LoginPage";
import DogSearchPage from "./pages/DogSearchPage";
import DogDetailsPage from "./pages/DogDetailsPage";
import "leaflet/dist/leaflet.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if session cookie is valid on load
  useEffect(() => {
    axios
      .get("https://frontend-take-home-service.fetch.com/dogs/breeds", {
        withCredentials: true,
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  // Keep session alive every 10 min while authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      axios
        .get("https://frontend-take-home-service.fetch.com/dogs/breeds", {
          withCredentials: true,
        })
        .catch((err) => {
          console.warn("Session keep-alive failed", err);
        });
    }, 10 * 60 * 1000); // every 10 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (checkingAuth) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Checking session...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DogSearchPage />
            ) : (
              <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <DogSearchPage />
            ) : (
              <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/dog/:id"
          element={
            isAuthenticated ? (
              <DogDetailsPage />
            ) : (
              <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <DogSearchPage />
            ) : (
              <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />
      </Routes>
    </Router>
  );
}
