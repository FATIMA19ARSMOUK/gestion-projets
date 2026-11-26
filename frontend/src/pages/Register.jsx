
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
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

    if (formData.password !== formData.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Impossible de créer le compte.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell auth-register">
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
            LET'S BUILD SOMETHING GREAT
          </div>

          <h1>
            Your next
            <br />
            <span>big thing</span>
            <br />
            starts here.
          </h1>

          <p className="auth-showcase-description">
            Create your workspace, bring your team together
            and turn ambitious ideas into real progress.
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
              <strong>Ideas become achievements.</strong>
              <small>Your journey starts today.</small>
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
          <span>Already have an account?</span>
          <Link to="/login" className="auth-top-link">
            Sign in <span>↗</span>
          </Link>
        </div>

        <div className="auth-form-wrapper">
          <div className="auth-mobile-brand">
            <span className="auth-brand-icon">T</span>
            <span>team<span>flow</span></span>
          </div>

          <div className="auth-form-heading">
            <div className="auth-form-tag">GET STARTED</div>
            <h2>Create your account<span>.</span></h2>
            <p>Start organizing your work with TeamFlow.</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="name">Full name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">♙</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

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
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password_confirmation">
                Confirm password
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">⌑</span>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              <span>{loading ? "Creating account..." : "Create my account"}</span>
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
