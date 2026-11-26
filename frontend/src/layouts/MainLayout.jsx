
import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Bell,
  Settings,
  Search,
  Globe,
  Menu,
  X,
  Layers,
  ChevronDown,
} from "lucide-react";
import "./MainLayout.css";

const translations = {
  fr: {
    dashboard: "Tableau de bord",
    projects: "Projets",
    tasks: "Tâches",
    team: "Équipe",
    notifications: "Notifications",
    settings: "Paramètres",
    workspace: "ESPACE DE TRAVAIL",
    search: "Rechercher...",
    language: "Français",
    profile: "Mon profil",
    logout: "Déconnexion",
  },
  en: {
    dashboard: "Dashboard",
    projects: "Projects",
    tasks: "Tasks",
    team: "Team",
    notifications: "Notifications",
    settings: "Settings",
    workspace: "WORKSPACE",
    search: "Search...",
    language: "English",
    profile: "My profile",
    logout: "Log out",
  },
};

export default function MainLayout() {
  const navigate = useNavigate();

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("appLanguage") || "fr";
  });

  // Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("appTheme") || "light";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // User
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Save language
  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  // Save theme
  useEffect(() => {
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  // Get authenticated user
  useEffect(() => {
    let active = true;

    async function fetchUser() {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const data = await apiRequest("/user");

        if (active && data) {
          const currentUser = data.user || data;

          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      } catch (error) {
        console.error("Impossible de récupérer le profil :", error);
      }
    }

    fetchUser();

    return () => {
      active = false;
    };
  }, []);

  const t = translations[language] || translations.fr;

  const initials = (user?.name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const navigation = [
    { label: t.dashboard, path: "/dashboard", icon: LayoutDashboard },
    { label: t.projects, path: "/projects", icon: FolderKanban },
    { label: t.tasks, path: "/tasks", icon: CheckSquare },
    { label: t.team, path: "/team", icon: Users },
    { label: t.notifications, path: "/notifications", icon: Bell },
  ];

  async function handleLogout() {
    try {
      await apiRequest("/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="tf-app" data-theme={theme}>
      {sidebarOpen && (
        <button
          className="tf-sidebar-overlay"
          aria-label="Fermer le menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`tf-sidebar ${sidebarOpen ? "tf-sidebar-open" : ""}`}>
        <div className="tf-brand">
          <div className="tf-brand-icon">
            <Layers size={23} />
          </div>

          <div className="tf-brand-text">
            <span>TeamFlow</span>
            <small>Project workspace</small>
          </div>

          <button
            className="tf-close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="tf-workspace">
          <span className="tf-workspace-avatar">T</span>

          <div className="tf-workspace-info">
            <strong>Team Workspace</strong>
            <small>Free workspace</small>
          </div>

          <ChevronDown size={16} />
        </div>

        <div className="tf-nav-label">{t.workspace}</div>

        <nav className="tf-navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/dashboard"}
              className={({ isActive }) =>
                `tf-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>

              {path === "/notifications" && (
                <span className="tf-notification-dot" />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="tf-sidebar-bottom">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `tf-nav-link ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>{t.settings}</span>
          </NavLink>

          <div className="tf-user-card">
            <div className="tf-user-avatar">{initials}</div>

            <div className="tf-user-info">
              <strong>{user?.name || "Utilisateur"}</strong>
              <small>{user?.role?.name || t.profile}</small>
            </div>

            <button
              type="button"
              className="tf-icon-button"
              aria-label="Ouvrir le menu du profil"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <ChevronDown size={16} />
            </button>

            {profileOpen && (
              <div className="tf-language-menu">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                >
                  {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="tf-main">
        <header className="tf-topbar">
          <button
            className="tf-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>

          <div className="tf-search">
            <Search size={18} />
            <input type="search" placeholder={t.search} />
            <kbd>⌘ K</kbd>
          </div>

          <div className="tf-topbar-actions">
            <div className="tf-language">
              <button
                className="tf-icon-button tf-language-button"
                onClick={() => setLanguageOpen(!languageOpen)}
                aria-label="Changer de langue"
              >
                <Globe size={18} />
                <span>{language.toUpperCase()}</span>
                <ChevronDown size={14} />
              </button>

              {languageOpen && (
                <div className="tf-language-menu">
                  <button
                    onClick={() => {
                      setLanguage("fr");
                      setLanguageOpen(false);
                    }}
                  >
                    🇫🇷 Français {language === "fr" ? "✓" : ""}
                  </button>

                  <button
                    onClick={() => {
                      setLanguage("en");
                      setLanguageOpen(false);
                    }}
                  >
                    🇬🇧 English {language === "en" ? "✓" : ""}
                  </button>
                </div>
              )}
            </div>

            <NavLink
              to="/notifications"
              className="tf-icon-button tf-bell-button"
              aria-label={t.notifications}
            >
              <Bell size={19} />
              <span />
            </NavLink>

            <div className="tf-topbar-avatar">{initials}</div>
          </div>
        </header>

        <main className="tf-content">
          <Outlet
            context={{
              language,
              setLanguage,
              theme,
              setTheme,
              user,
              setUser,
            }}
          />
        </main>
      </div>
    </div>
  );
}
