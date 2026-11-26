
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      {/* LEFT VISUAL PANEL */}
      <section className="auth-showcase">
        <div className="auth-glow auth-glow-one"></div>
        <div className="auth-glow auth-glow-two"></div>

        <Link to="/login" className="auth-brand">
          <span className="auth-brand-icon">T</span>
          <span>team<span>flow</span></span>
        </Link>

        <div className="auth-showcase-content">
          <div className="auth-eyebrow">
            <span className="auth-eyebrow-dot"></span>
            YOUR WORKSPACE, REIMAGINED
          </div>

          <h1>
            Great teams.
            <br />
            <span>Better work.</span>
          </h1>

          <p className="auth-showcase-description">
            Bring your people, projects and ideas together.
            Everything your team needs, all in one place.
          </p>

          <div className="auth-visual">
            <div className="visual-orbit orbit-one"></div>
            <div className="visual-orbit orbit-two"></div>
            <div className="visual-core">
              <div className="visual-core-inner">T</div>
            </div>

            <div className="visual-node node-one">
              <span>✦</span>
            </div>
            <div className="visual-node node-two">
              <span>✓</span>
            </div>
            <div className="visual-node node-three">
              <span>↗</span>
            </div>
            <div className="visual-node node-four">
              <span>⌘</span>
            </div>
          </div>

          <div className="auth-showcase-bottom">
            <div className="auth-mini-avatars">
              <span>F</span>
              <span>A</span>
              <span>M</span>
              <span>+</span>
            </div>
            <div>
              <strong>One team. One direction.</strong>
              <small>Make progress together.</small>
            </div>
          </div>
        </div>

        <div className="auth-showcase-footer">
          <span>© 2026 TeamFlow</span>
          <span>Built for better collaboration.</span>
        </div>
      </section>

      {/* RIGHT FORM PANEL */}
      <main className="auth-main">
        <div className="auth-main-top">
          <span>New to TeamFlow?</span>
          <Link to="/register" className="auth-top-link">
            Create an account <span>↗</span>
          </Link>
        </div>

        <div className="auth-form-wrapper">
          <div className="auth-mobile-brand">
            <span className="auth-brand-icon">T</span>
            <span>team<span>flow</span></span>
          </div>

          <div className="auth-form-heading">
            <div className="auth-form-tag">WELCOME BACK</div>
            <h2>Good to see you<span>.</span></h2>
            <p>Enter your details to access your workspace.</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">⌑</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              <span>{loading ? "Signing in..." : "Sign in to TeamFlow"}</span>
              {!loading && <span className="auth-submit-arrow">→</span>}
            </button>
          </form>

          <div className="auth-form-footer">
            <span>Protected workspace</span>
            <span className="auth-secure-dot"></span>
            <span>Secure access</span>
          </div>
        </div>

        <div className="auth-main-footer">
          By continuing, you agree to use TeamFlow responsibly.
        </div>
      </main>
    </div>
  );
}
