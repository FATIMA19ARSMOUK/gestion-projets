
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  UserRound,
  Globe,
  Bell,
  ShieldCheck,
  Camera,
  Save,
  Mail,
  LockKeyhole,
  Check,
} from "lucide-react";
import "./Settings.css";

export default function Settings() {
  const { language } = useOutletContext() || {};
  const isFr = language !== "en";

  const [activeSection, setActiveSection] = useState("profile");
  const [name, setName] = useState("Fatima");
  const [email, setEmail] = useState("fatima@example.com");
  const [jobTitle, setJobTitle] = useState("Développeuse Full Stack");
  const [appLanguage, setAppLanguage] = useState(isFr ? "fr" : "en");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);

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
      description: isFr ? "Langue et affichage" : "Language and display",
      icon: Globe,
    },
    {
      id: "notifications",
      label: isFr ? "Notifications" : "Notifications",
      description: isFr ? "Gérer les alertes" : "Manage alerts",
      icon: Bell,
    },
    {
      id: "security",
      label: isFr ? "Sécurité" : "Security",
      description: isFr ? "Mot de passe et accès" : "Password and access",
      icon: ShieldCheck,
    },
  ];

  const handleSave = (event) => {
    event.preventDefault();

    if (
      activeSection === "security" &&
      newPassword &&
      newPassword !== confirmPassword
    ) {
      window.alert(
        isFr
          ? "Les mots de passe ne correspondent pas."
          : "Passwords do not match."
      );
      return;
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

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
              ? "Gérez votre profil et personnalisez votre expérience TeamFlow."
              : "Manage your profile and personalize your TeamFlow experience."}
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
                onClick={() => {
                  setActiveSection(section.id);
                  setSaved(false);
                }}
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
          <form onSubmit={handleSave}>
            {activeSection === "profile" && (
              <>
                <div className="settings-section-heading">
                  <div className="settings-heading-icon">
                    <UserRound size={21} />
                  </div>
                  <div>
                    <h2>{isFr ? "Informations du profil" : "Profile information"}</h2>
                    <p>
                      {isFr
                        ? "Ces informations représentent votre identité sur TeamFlow."
                        : "This information represents your identity on TeamFlow."}
                    </p>
                  </div>
                </div>

                <div className="settings-avatar-block">
                  <div className="settings-avatar">F</div>
                  <div>
                    <strong>{name || (isFr ? "Votre nom" : "Your name")}</strong>
                    <p>
                      {isFr
                        ? "Votre profil est visible par les membres de vos projets."
                        : "Your profile is visible to your project members."}
                    </p>
                    <button
                      type="button"
                      className="settings-secondary-button"
                      onClick={() =>
                        window.alert(
                          isFr
                            ? "L'ajout d'une photo sera disponible plus tard."
                            : "Photo upload will be available later."
                        )
                      }
                    >
                      <Camera size={15} />
                      {isFr ? "Modifier la photo" : "Change photo"}
                    </button>
                  </div>
                </div>

                <div className="settings-form-grid">
                  <label className="settings-field">
                    <span>{isFr ? "Nom complet" : "Full name"}</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isFr ? "Votre nom" : "Your name"}
                      required
                    />
                  </label>

                  <label className="settings-field">
                    <span>{isFr ? "Adresse e-mail" : "Email address"}</span>
                    <div className="settings-input-icon">
                      <Mail size={17} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@exemple.com"
                        required
                      />
                    </div>
                  </label>

                  <label className="settings-field settings-field-full">
                    <span>{isFr ? "Poste / Fonction" : "Job title"}</span>
                    <input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder={isFr ? "Votre fonction" : "Your job title"}
                    />
                  </label>
                </div>
              </>
            )}

            {activeSection === "preferences" && (
              <>
                <div className="settings-section-heading">
                  <div className="settings-heading-icon">
                    <Globe size={21} />
                  </div>
                  <div>
                    <h2>{isFr ? "Préférences générales" : "General preferences"}</h2>
                    <p>
                      {isFr
                        ? "Personnalisez la langue de votre espace."
                        : "Customize your workspace language."}
                    </p>
                  </div>
                </div>

                <label className="settings-field settings-field-full">
                  <span>{isFr ? "Langue de l'interface" : "Interface language"}</span>
                  <select
                    value={appLanguage}
                    onChange={(e) => setAppLanguage(e.target.value)}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                  <small className="settings-help">
                    {isFr
                      ? "Ce choix sera enregistré dans l'interface de démonstration."
                      : "This choice will be saved in the demo interface."}
                  </small>
                </label>

                <div className="settings-info-box">
                  <Globe size={19} />
                  <p>
                    {isFr
                      ? "D'autres préférences d'affichage pourront être ajoutées plus tard."
                      : "More display preferences can be added later."}
                  </p>
                </div>
              </>
            )}

            {activeSection === "notifications" && (
              <>
                <div className="settings-section-heading">
                  <div className="settings-heading-icon">
                    <Bell size={21} />
                  </div>
                  <div>
                    <h2>{isFr ? "Préférences de notification" : "Notification preferences"}</h2>
                    <p>
                      {isFr
                        ? "Choisissez les alertes que vous souhaitez recevoir."
                        : "Choose which alerts you want to receive."}
                    </p>
                  </div>
                </div>

                <div className="settings-options-list">
                  <label className="settings-option">
                    <span>
                      <strong>{isFr ? "Notifications par e-mail" : "Email notifications"}</strong>
                      <small>
                        {isFr
                          ? "Recevoir les mises à jour par e-mail."
                          : "Receive updates by email."}
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  </label>

                  <label className="settings-option">
                    <span>
                      <strong>{isFr ? "Mises à jour des tâches" : "Task updates"}</strong>
                      <small>
                        {isFr
                          ? "Quand une tâche vous est assignée ou modifiée."
                          : "When a task is assigned to you or updated."}
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={taskNotifications}
                      onChange={(e) => setTaskNotifications(e.target.checked)}
                    />
                  </label>

                  <label className="settings-option">
                    <span>
                      <strong>{isFr ? "Nouveaux commentaires" : "New comments"}</strong>
                      <small>
                        {isFr
                          ? "Quand quelqu'un commente une tâche."
                          : "When someone comments on a task."}
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={commentNotifications}
                      onChange={(e) => setCommentNotifications(e.target.checked)}
                    />
                  </label>
                </div>
              </>
            )}

            {activeSection === "security" && (
              <>
                <div className="settings-section-heading">
                  <div className="settings-heading-icon">
                    <ShieldCheck size={21} />
                  </div>
                  <div>
                    <h2>{isFr ? "Sécurité du compte" : "Account security"}</h2>
                    <p>
                      {isFr
                        ? "Modifiez votre mot de passe pour sécuriser votre compte."
                        : "Change your password to keep your account secure."}
                    </p>
                  </div>
                </div>

                <div className="settings-form-grid">
                  <label className="settings-field settings-field-full">
                    <span>{isFr ? "Mot de passe actuel" : "Current password"}</span>
                    <div className="settings-input-icon">
                      <LockKeyhole size={17} />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </label>

                  <label className="settings-field">
                    <span>{isFr ? "Nouveau mot de passe" : "New password"}</span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={8}
                    />
                  </label>

                  <label className="settings-field">
                    <span>{isFr ? "Confirmer le mot de passe" : "Confirm password"}</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={8}
                    />
                  </label>
                </div>

                <div className="settings-info-box">
                  <ShieldCheck size={19} />
                  <p>
                    {isFr
                      ? "Le changement réel du mot de passe sera connecté à l'API Laravel plus tard."
                      : "Actual password changes will be connected to the Laravel API later."}
                  </p>
                </div>
              </>
            )}

            <div className="settings-footer">
              <span className={`settings-saved-message ${saved ? "visible" : ""}`}>
                {saved && (
                  <>
                    <Check size={16} />
                    {isFr ? "Modifications enregistrées (démo)" : "Changes saved (demo)"}
                  </>
                )}
              </span>

              <button type="submit" className="settings-save-button">
                <Save size={17} />
                {isFr ? "Enregistrer les modifications" : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
