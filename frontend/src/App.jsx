
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Team from "./pages/Team";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

import {
  FeaturesPage,
  HowItWorksPage,
  AboutPage,
  FAQPage,
} from "./pages/LandingInfoPages";

import "./index.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/dashboard" replace /> : children;
}

function PublicPlaceholder({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Cette page sera développée prochainement.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/features" element={<FeaturesPage />} />

        <Route path="/how-it-works" element={<HowItWorksPage />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/faq" element={<FAQPage />} />

        {/* Authentication */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* Protected application */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/team" element={<Team />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<PublicPlaceholder title="Page introuvable" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
