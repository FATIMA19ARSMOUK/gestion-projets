
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  UserRound,
  Globe,
  Bell,
  Sun,
  Moon,
  Mail,
  Check,
  Monitor,
} from "lucide-react";
import "./Settings.css";

const defaultNotifications = {
  email: true,
  tasks: true,
  comments: true,
};

function getNotificationPreferences() {
  try {
    const saved = localStorage.getItem("notificationPreferences");

    return saved
      ? { ...defaultNotifications, ...JSON.parse(saved) }
      : defaultNotifications;
  } catch {
    return defaultNotifications;
  }
}

export default function Settings() {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    user,
  } = useOutletContext() || {};

  const isFr = language !== "en";

  const [activeSection, setActiveSection] = useState("profile");

  const [notifications, setNotifications] = useState(
    getNotificationPreferences
  );

  const sections = [
    {
      id: "profile",
      label: isFr ? "Profil" : "Profile",
      description: isFr ? "Informations personnelles" : "Personal information",
      icon: UserRound,
    },
    {
      id: "preferences",
      label: isFr ? "Préférences" : "Preferences",
      description: isFr ? "Langue de l'application" : "Application language",
      icon: Globe,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: isFr ? "Gérer les préférences" : "Manage preferences",
      icon: Bell,
    },
    {
      id: "appearance",
      label: isFr ? "Apparence" : "Appearance",
      description: isFr ? "Thème de l'application" : "Application theme",
      icon: Sun,
    },
  ];

  const initials = (user?.name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function updateNotification(key, value) {
    const updated = {
      ...notifications,
      [key]: value,
    };

    setNotifications(updated);

    localStorage.setItem(
      "notificationPreferences",
      JSON.stringify(updated)
    );
  }

  return (
    <main className="settings-page">
      <header className="settings-header">
        <div>
          <span className="settings-eyebrow">
            {isFr ? "ESPACE PERSONNEL" : "PERSONAL SPACE"}
          </span>

          <h1>{isFr ? "Paramètres" : "Settings"}</h1>

          <p>
            {isFr
              ? "Gérez vos préférences et personnalisez votre espace TeamFlow."
              : "Manage your preferences and personalize your TeamFlow workspace."}
          </p>
        </div>
      </header>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="settings-sidebar-title">
            {isFr ? "PRÉFÉRENCES DU COMPTE" : "ACCOUNT PREFERENCES"}
          </div>

          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                type="button"
                className={`settings-nav-item ${
                  activeSection === section.id ? "active" : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="settings-nav-icon">
                  <Icon size={19} />
                </span>

                <span className="settings-nav-text">
                  <strong>{section.label}</strong>
                  <small>{section.description}</small>
                </span>
              </button>
            );
          })}
        </aside>

        <section className="settings-content">

          {/* PROFILE */}
          {activeSection === "profile" && (
            <>
              <div className="settings-section-heading">
                <div className="settings-heading-icon">
                  <UserRound size={21} />
                </div>

                <div>
                  <h2>
                    {isFr ? "Informations du profil" : "Profile information"}
                  </h2>

                  <p>
                    {isFr
                      ? "Les informations de votre compte TeamFlow."
                      : "Your TeamFlow account information."}
                  </p>
                </div>
              </div>

              <div className="settings-avatar-block">
                <div className="settings-avatar">
                  {initials}
                </div>

                <div>
                  <strong>{user?.name || (isFr ? "Utilisateur" : "User")}</strong>

                  <p>
                    {isFr
                      ? "Votre profil est associé à votre compte TeamFlow."
                      : "Your profile is linked to your TeamFlow account."}
                  </p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="settings-field">
                  <span>{isFr ? "Nom complet" : "Full name"}</span>

                  <input
                    type="text"
                    value={user?.name || ""}
                    readOnly
                  />
                </label>

                <label className="settings-field">
                  <span>{isFr ? "Adresse e-mail" : "Email address"}</span>

                  <div className="settings-input-icon">
                    <Mail size={17} />

                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                    />
                  </div>
                </label>

                <label className="settings-field settings-field-full">
                  <span>{isFr ? "Rôle" : "Role"}</span>

                  <input
                    type="text"
                    value={user?.role?.name || (isFr ? "Non défini" : "Not defined")}
                    readOnly
                  />
                </label>
              </div>
            </>
          )}

          {/* PREFERENCES */}
          {activeSection === "preferences" && (
            <>
              <div className="settings-section-heading">
                <div className="settings-heading-icon">
                  <Globe size={21} />
                </div>

                <div>
                  <h2>
                    {isFr ? "Préférences générales" : "General preferences"}
                  </h2>

                  <p>
                    {isFr
                      ? "Choisissez la langue de votre espace de travail."
                      : "Choose your workspace language."}
                  </p>
                </div>
              </div>

              <label className="settings-field settings-field-full">
                <span>
                  {isFr ? "Langue de l'interface" : "Interface language"}
                </span>

                <select
                  value={language || "fr"}
                  onChange={(e) => setLanguage?.(e.target.value)}
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇬🇧 English</option>
                </select>

                <small className="settings-help">
                  {isFr
                    ? "La langue sera appliquée à l'ensemble de l'interface."
                    : "The language will be applied throughout the interface."}
                </small>
              </label>

              <div className="settings-info-box">
                <Globe size={19} />

                <p>
                  {isFr
                    ? "Votre choix est sauvegardé automatiquement."
                    : "Your choice is saved automatically."}
                </p>
              </div>
            </>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <>
              <div className="settings-section-heading">
                <div className="settings-heading-icon">
                  <Bell size={21} />
                </div>

                <div>
                  <h2>
                    {isFr
                      ? "Préférences de notification"
                      : "Notification preferences"}
                  </h2>

                  <p>
                    {isFr
                      ? "Personnalisez vos préférences de notification."
                      : "Customize your notification preferences."}
                  </p>
                </div>
              </div>

              <div className="settings-options-list">
                <label className="settings-option">
                  <span>
                    <strong>
                      {isFr ? "Notifications par e-mail" : "Email notifications"}
                    </strong>

                    <small>
                      {isFr
                        ? "Préférence pour les notifications par e-mail."
                        : "Preference for email notifications."}
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      updateNotification("email", e.target.checked)
                    }
                  />
                </label>

                <label className="settings-option">
                  <span>
                    <strong>
                      {isFr ? "Mises à jour des tâches" : "Task updates"}
                    </strong>

                    <small>
                      {isFr
                        ? "Préférence pour les alertes liées aux tâches."
                        : "Preference for task-related alerts."}
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    checked={notifications.tasks}
                    onChange={(e) =>
                      updateNotification("tasks", e.target.checked)
                    }
                  />
                </label>

                <label className="settings-option">
                  <span>
                    <strong>
                      {isFr ? "Nouveaux commentaires" : "New comments"}
                    </strong>

                    <small>
                      {isFr
                        ? "Préférence pour les alertes de commentaires."
                        : "Preference for comment alerts."}
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    checked={notifications.comments}
                    onChange={(e) =>
                      updateNotification("comments", e.target.checked)
                    }
                  />
                </label>
              </div>

              <div className="settings-info-box">
                <Bell size={19} />

                <p>
                  {isFr
                    ? "Ces préférences sont enregistrées sur cet appareil. Elles ne désactivent pas encore les notifications générées par le serveur."
                    : "These preferences are saved on this device. They do not yet disable notifications generated by the server."}
                </p>
              </div>
            </>
          )}

          {/* APPEARANCE */}
          {activeSection === "appearance" && (
            <>
              <div className="settings-section-heading">
                <div className="settings-heading-icon">
                  <Sun size={21} />
                </div>

                <div>
                  <h2>{isFr ? "Apparence" : "Appearance"}</h2>

                  <p>
                    {isFr
                      ? "Choisissez le thème visuel de TeamFlow."
                      : "Choose the visual theme of TeamFlow."}
                  </p>
                </div>
              </div>

              <div className="settings-options-list">
                <button
                  type="button"
                  className={`settings-option settings-theme-option ${
                    theme === "light" ? "selected" : ""
                  }`}
                  onClick={() => setTheme?.("light")}
                >
                  <span className="settings-theme-icon">
                    <Sun size={21} />
                  </span>

                  <span>
                    <strong>{isFr ? "Mode clair" : "Light mode"}</strong>
                    <small>
                      {isFr
                        ? "Une interface claire et lumineuse."
                        : "A bright and clean interface."}
                    </small>
                  </span>

                  {theme === "light" && (
                    <Check size={19} className="settings-theme-check" />
                  )}
                </button>

                <button
                  type="button"
                  className={`settings-option settings-theme-option ${
                    theme === "dark" ? "selected" : ""
                  }`}
                  onClick={() => setTheme?.("dark")}
                >
                  <span className="settings-theme-icon">
                    <Moon size={21} />
                  </span>

                  <span>
                    <strong>{isFr ? "Mode sombre" : "Dark mode"}</strong>
                    <small>
                      {isFr
                        ? "Une interface sombre pour plus de confort."
                        : "A dark interface for more visual comfort."}
                    </small>
                  </span>

                  {theme === "dark" && (
                    <Check size={19} className="settings-theme-check" />
                  )}
                </button>
              </div>

              <div className="settings-info-box">
                <Monitor size={19} />

                <p>
                  {isFr
                    ? "Votre thème est sauvegardé automatiquement."
                    : "Your theme is saved automatically."}
                </p>
              </div>
            </>
          )}

        </section>
      </div>
    </main>
  );
}
