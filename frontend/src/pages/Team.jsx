
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  ShieldCheck,
  BriefcaseBusiness,
  UserRound,
  Mail,
  RefreshCw,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import { apiRequest } from "../services/api";
import "./Team.css";

const roleClasses = {
  Admin: "team-role-admin",
  "Chef de projet": "team-role-manager",
  Membre: "team-role-member",
};

const avatarColors = [
  ["#e9eaff", "#5145cd"],
  ["#dff5ee", "#087f5b"],
  ["#fff0dc", "#b76b08"],
  ["#e0efff", "#2463a8"],
  ["#fbe5f3", "#b83280"],
  ["#eee6ff", "#7048c8"],
];

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "Membre",
};

export default function Team() {
  const outletContext = useOutletContext() || {};
  const { language } = outletContext;
  const isFr = language !== "en";

  const currentUser = outletContext.user || getStoredUser();

  const currentRole =
    typeof currentUser?.role === "object"
      ? currentUser.role?.name
      : currentUser?.role;

  const isAdmin = currentRole === "Admin";

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingMember, setDeletingMember] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchMembers();
  }, []);

  // Charger les membres
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/team");

      const users = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];

      const formattedMembers = users.map((user, index) => {
        const role =
          typeof user.role === "object"
            ? user.role?.name
            : user.role;

        const [color, textColor] =
          avatarColors[index % avatarColors.length];

        return {
          id: user.id,
          name: user.name || "—",
          email: user.email || "—",
          role: role || "Membre",
          department: "—",
          status: "Non défini",
          initials: getInitials(user.name),
          color,
          textColor,
        };
      });

      setMembers(formattedMembers);
    } catch (err) {
      console.error("Erreur chargement équipe :", err);

      setError(
        err.message ||
          (isFr
            ? "Impossible de charger les membres."
            : "Unable to load team members.")
      );
    } finally {
      setLoading(false);
    }
  };

  // Recherche et filtre
  const filteredMembers = members.filter((member) => {
    const term = search.trim().toLowerCase();

    const matchesSearch = [
      member.name,
      member.email,
      member.role,
    ]
      .join(" ")
      .toLowerCase()
      .includes(term);

    const matchesRole =
      roleFilter === "Tous" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const memberCount = members.filter(
    (member) => member.role === "Membre"
  ).length;

  const managerCount = members.filter(
    (member) => member.role === "Chef de projet"
  ).length;

  const adminCount = members.filter(
    (member) => member.role === "Admin"
  ).length;

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({ ...emptyForm });
    setFormError("");
    setEditingMember(null);
  };

  // Ouvrir le formulaire d'ajout
  const openAddForm = () => {
    resetForm();
    setShowForm(true);
    setSuccess("");
  };

  // Ouvrir le formulaire de modification
  const openEditForm = (member) => {
    setEditingMember(member);

    setFormData({
      name: member.name,
      email: member.email,
      password: "",
      password_confirmation: "",
      role: member.role,
    });

    setFormError("");
    setSuccess("");
    setShowForm(true);
  };

  // Ajouter ou modifier un membre
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setFormError(
        isFr
          ? "Vous n'avez pas l'autorisation."
          : "You are not authorized."
      );
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError(
        isFr
          ? "Veuillez remplir tous les champs obligatoires."
          : "Please fill in all required fields."
      );
      return;
    }

    if (!editingMember) {
      if (formData.password.length < 8) {
        setFormError(
          isFr
            ? "Le mot de passe doit contenir au moins 8 caractères."
            : "Password must contain at least 8 characters."
        );
        return;
      }

      if (formData.password !== formData.password_confirmation) {
        setFormError(
          isFr
            ? "Les mots de passe ne correspondent pas."
            : "Passwords do not match."
        );
        return;
      }
    }

    try {
      setSaving(true);
      setFormError("");
      setError("");
      setSuccess("");

      if (editingMember) {
        // Modification
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
        };

        await apiRequest(`/team/${editingMember.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setSuccess(
          isFr
            ? "Le membre a été modifié avec succès."
            : "Member updated successfully."
        );
      } else {
        // Ajout
        await apiRequest("/team", {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            name: formData.name.trim(),
            email: formData.email.trim(),
          }),
        });

        setSuccess(
          isFr
            ? "Le membre a été ajouté avec succès."
            : "Member added successfully."
        );
      }

      setShowForm(false);
      resetForm();

      await fetchMembers();
    } catch (err) {
      console.error("Erreur opération membre :", err);

      setFormError(
        err.message ||
          (isFr
            ? "Une erreur est survenue."
            : "An error occurred.")
      );
    } finally {
      setSaving(false);
    }
  };

  // Fermer le formulaire
  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    resetForm();
  };

  // Ouvrir confirmation de suppression
  const openDeleteConfirm = (member) => {
    setDeletingMember(member);
    setShowDeleteConfirm(true);
    setSuccess("");
    setError("");
  };

  // Supprimer un membre
  const handleDeleteMember = async () => {
    if (!deletingMember || !isAdmin) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await apiRequest(`/team/${deletingMember.id}`, {
        method: "DELETE",
      });

      setShowDeleteConfirm(false);

      setSuccess(
        isFr
          ? "Le membre a été supprimé avec succès."
          : "Member deleted successfully."
      );

      setDeletingMember(null);

      await fetchMembers();
    } catch (err) {
      console.error("Erreur suppression membre :", err);

      setError(
        err.message ||
          (isFr
            ? "Impossible de supprimer ce membre."
            : "Unable to delete this member.")
      );

      setShowDeleteConfirm(false);
      setDeletingMember(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="team-page">
      {/* Header */}
      <header className="team-header">
        <div>
          <div className="team-eyebrow">
            <Users size={15} />
            COLLABORATION
          </div>

          <h1>{isFr ? "Équipe" : "Team"}</h1>

          <p>
            {isFr
              ? "Consultez les membres et les rôles de votre équipe."
              : "View your team members and their roles."}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="team-add-button"
            onClick={fetchMembers}
            disabled={loading}
          >
            <RefreshCw size={17} />
            {isFr ? "Actualiser" : "Refresh"}
          </button>

          {isAdmin && (
            <button
              type="button"
              className="team-add-button"
              onClick={openAddForm}
            >
              <Plus size={18} />
              {isFr ? "Ajouter un membre" : "Add member"}
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      {success && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "18px",
            borderRadius: "9px",
            background: "#dcfce7",
            color: "#166534",
            fontSize: "14px",
          }}
        >
          {success}
        </div>
      )}

      {error && (
        <div className="notifications-error" style={{ marginBottom: "18px" }}>
          {error}
        </div>
      )}

      {/* Statistics */}
      <section className="team-stats">
        <article className="team-stat-card">
          <span className="team-stat-icon team-stat-blue">
            <Users size={20} />
          </span>
          <div>
            <p>{isFr ? "Total des utilisateurs" : "Total users"}</p>
            <strong>{members.length}</strong>
          </div>
        </article>

        <article className="team-stat-card">
          <span className="team-stat-icon team-stat-green">
            <UserRound size={20} />
          </span>
          <div>
            <p>{isFr ? "Membres" : "Members"}</p>
            <strong>{memberCount}</strong>
          </div>
        </article>

        <article className="team-stat-card">
          <span className="team-stat-icon team-stat-purple">
            <BriefcaseBusiness size={20} />
          </span>
          <div>
            <p>{isFr ? "Chefs de projet" : "Project managers"}</p>
            <strong>{managerCount}</strong>
          </div>
        </article>

        <article className="team-stat-card">
          <span className="team-stat-icon team-stat-orange">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p>{isFr ? "Administrateurs" : "Administrators"}</p>
            <strong>{adminCount}</strong>
          </div>
        </article>
      </section>

      {/* Search and filter */}
      <section className="team-toolbar">
        <label className="team-search">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              isFr ? "Rechercher un membre..." : "Search members..."
            }
          />
        </label>

        <select
          className="team-role-filter"
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          aria-label={isFr ? "Filtrer par rôle" : "Filter by role"}
        >
          <option value="Tous">
            {isFr ? "Tous les rôles" : "All roles"}
          </option>
          <option value="Admin">Admin</option>
          <option value="Chef de projet">
            {isFr ? "Chef de projet" : "Project manager"}
          </option>
          <option value="Membre">
            {isFr ? "Membre" : "Member"}
          </option>
        </select>
      </section>

      {/* Members table */}
      <section className="team-list-container">
        <div className="team-list-heading">
          <div>
            <h2>{isFr ? "Tous les membres" : "All members"}</h2>
            <p>
              {filteredMembers.length}{" "}
              {isFr ? "membre(s) affiché(s)" : "member(s) displayed"}
            </p>
          </div>

          <span className="team-list-count">{members.length}</span>
        </div>

        <div className="team-table-scroll">
          <table className="team-table">
            <thead>
              <tr>
                <th>{isFr ? "Membre" : "Member"}</th>
                <th>{isFr ? "Département" : "Department"}</th>
                <th>{isFr ? "Rôle" : "Role"}</th>
                <th>{isFr ? "Statut" : "Status"}</th>
                {isAdmin && (
                  <th>{isFr ? "Actions" : "Actions"}</th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="team-empty">
                    {isFr
                      ? "Chargement des membres..."
                      : "Loading members..."}
                  </td>
                </tr>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="team-member-cell">
                        <span
                          className="team-avatar"
                          style={{
                            backgroundColor: member.color,
                            color: member.textColor,
                          }}
                        >
                          {member.initials}
                        </span>

                        <div className="team-member-info">
                          <strong>{member.name}</strong>
                          <span>
                            <Mail size={13} />
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="team-department">
                        {member.department}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`team-role-badge ${
                          roleClasses[member.role] || "team-role-member"
                        }`}
                      >
                        {member.role === "Chef de projet" && (
                          <BriefcaseBusiness size={13} />
                        )}

                        {member.role === "Admin" && (
                          <ShieldCheck size={13} />
                        )}

                        {member.role === "Membre" && (
                          <UserRound size={13} />
                        )}

                        {isFr
                          ? member.role
                          : {
                              Admin: "Admin",
                              "Chef de projet": "Project manager",
                              Membre: "Member",
                            }[member.role] || member.role}
                      </span>
                    </td>

                    <td>
                      <span className="team-department">
                        {member.status}
                      </span>
                    </td>

                    {isAdmin && (
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => openEditForm(member)}
                            title={isFr ? "Modifier" : "Edit"}
                            aria-label={isFr ? "Modifier" : "Edit"}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "34px",
                              height: "34px",
                              border: "1px solid #dbe3f0",
                              borderRadius: "8px",
                              background: "#f8fafc",
                              color: "#475569",
                              cursor: "pointer",
                            }}
                          >
                            <Pencil size={16} />
                          </button>

                          {String(member.id) !== String(currentUser?.id) && (
                            <button
                              type="button"
                              onClick={() => openDeleteConfirm(member)}
                              title={isFr ? "Supprimer" : "Delete"}
                              aria-label={isFr ? "Supprimer" : "Delete"}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "34px",
                                height: "34px",
                                border: "1px solid #fecaca",
                                borderRadius: "8px",
                                background: "#fff7f7",
                                color: "#dc2626",
                                cursor: "pointer",
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="team-empty">
                    {isFr
                      ? "Aucun membre trouvé."
                      : "No members found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add / Edit modal */}
      {showForm && isAdmin && (
        <div
          className="team-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            className="team-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
          >
            <header className="team-modal-header">
              <div>
                <h2 id="team-modal-title">
                  {editingMember
                    ? isFr
                      ? "Modifier le membre"
                      : "Edit member"
                    : isFr
                      ? "Ajouter un membre"
                      : "Add a member"}
                </h2>

                <p>
                  {editingMember
                    ? isFr
                      ? "Modifiez les informations du membre."
                      : "Update the member's information."
                    : isFr
                      ? "Renseignez les informations du nouvel utilisateur."
                      : "Enter the new user's information."}
                </p>
              </div>

              <button
                type="button"
                className="team-modal-close"
                onClick={closeForm}
                aria-label={isFr ? "Fermer" : "Close"}
                disabled={saving}
              >
                <X size={19} />
              </button>
            </header>

            <form className="team-form" onSubmit={handleSubmit}>
              <label>
                {isFr ? "Nom complet" : "Full name"}
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                  placeholder={isFr ? "Ex. Sara Amrani" : "e.g. Sara Amrani"}
                />
              </label>

              <label>
                {isFr ? "Adresse e-mail" : "Email address"}
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      email: event.target.value,
                    })
                  }
                  placeholder="nom@exemple.com"
                />
              </label>

              {!editingMember && (
                <>
                  <label>
                    {isFr ? "Mot de passe" : "Password"}
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          password: event.target.value,
                        })
                      }
                      placeholder={
                        isFr
                          ? "Minimum 8 caractères"
                          : "Minimum 8 characters"
                      }
                    />
                  </label>

                  <label>
                    {isFr
                      ? "Confirmer le mot de passe"
                      : "Confirm password"}
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={formData.password_confirmation}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          password_confirmation: event.target.value,
                        })
                      }
                      placeholder={
                        isFr
                          ? "Répétez le mot de passe"
                          : "Repeat the password"
                      }
                    />
                  </label>
                </>
              )}

              <label>
                {isFr ? "Rôle" : "Role"}
                <select
                  value={formData.role}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      role: event.target.value,
                    })
                  }
                >
                  <option value="Membre">
                    {isFr ? "Membre" : "Member"}
                  </option>

                  <option value="Chef de projet">
                    {isFr ? "Chef de projet" : "Project manager"}
                  </option>
                </select>
              </label>

              {formError && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "13px",
                    margin: "0",
                  }}
                >
                  {formError}
                </p>
              )}

              <footer className="team-form-actions">
                <button
                  type="button"
                  className="team-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  {isFr ? "Annuler" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="team-submit-button"
                  disabled={saving}
                >
                  {editingMember ? (
                    <Pencil size={16} />
                  ) : (
                    <Plus size={16} />
                  )}

                  {saving
                    ? isFr
                      ? "Enregistrement..."
                      : "Saving..."
                    : editingMember
                      ? isFr
                        ? "Enregistrer les modifications"
                        : "Save changes"
                      : isFr
                        ? "Ajouter le membre"
                        : "Add member"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && deletingMember && (
        <div
          className="team-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              setShowDeleteConfirm(false);
              setDeletingMember(null);
            }
          }}
        >
          <section
            className="team-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-member-title"
            style={{ maxWidth: "430px" }}
          >
            <header className="team-modal-header">
              <div>
                <h2 id="delete-member-title">
                  {isFr ? "Supprimer le membre" : "Delete member"}
                </h2>

                <p>
                  {isFr
                    ? "Cette action supprimera définitivement cet utilisateur."
                    : "This action will permanently delete this user."}
                </p>
              </div>

              <button
                type="button"
                className="team-modal-close"
                disabled={deleting}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingMember(null);
                }}
              >
                <X size={19} />
              </button>
            </header>

            <div style={{ padding: "20px 0" }}>
              <p style={{ color: "#475569", fontSize: "14px" }}>
                {isFr
                  ? "Voulez-vous vraiment supprimer :"
                  : "Are you sure you want to delete:"}
              </p>

              <strong style={{ color: "#1e293b" }}>
                {deletingMember.name}
              </strong>

              <p style={{ color: "#64748b", fontSize: "13px" }}>
                {deletingMember.email}
              </p>
            </div>

            <footer
              className="team-form-actions"
              style={{ justifyContent: "flex-end" }}
            >
              <button
                type="button"
                className="team-cancel-button"
                disabled={deleting}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingMember(null);
                }}
              >
                {isFr ? "Annuler" : "Cancel"}
              </button>

              <button
                type="button"
                onClick={handleDeleteMember}
                disabled={deleting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                <Trash2 size={16} />
                {deleting
                  ? isFr
                    ? "Suppression..."
                    : "Deleting..."
                  : isFr
                    ? "Supprimer"
                    : "Delete"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
