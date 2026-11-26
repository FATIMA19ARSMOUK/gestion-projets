
import { useEffect, useMemo, useState } from "react";
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
  UserPlus,
  UserCheck,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import { apiRequest } from "../services/api";
import "./Team.css";

const roleClasses = {
  Admin: "team-role-admin",
  "Chef de projet": "team-role-manager",
  Membre: "team-role-member",
};

const avatarColors = [
  ["#eeeaff", "#6548d7"],
  ["#e2f5ed", "#16845c"],
  ["#fff0df", "#b76b08"],
  ["#e3efff", "#2463a8"],
  ["#fbe8f3", "#b83280"],
  ["#f0eaff", "#7048c8"],
];

const getInitials = (name = "") =>
  name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

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

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/team");
      const users = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setMembers(
        users.map((user, index) => {
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
            initials: getInitials(user.name),
            color,
            textColor,
          };
        })
      );
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

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch = [
        member.name,
        member.email,
        member.role,
      ].join(" ").toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "Tous" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  const memberCount = members.filter((m) => m.role === "Membre").length;
  const managerCount = members.filter((m) => m.role === "Chef de projet").length;
  const adminCount = members.filter((m) => m.role === "Admin").length;

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setFormError("");
    setEditingMember(null);
  };

  const openAddForm = () => {
    resetForm();
    setSuccess("");
    setShowForm(true);
  };

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

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setFormError(isFr ? "Vous n'avez pas l'autorisation." : "You are not authorized.");
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
        await apiRequest(`/team/${editingMember.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role,
          }),
        });

        setSuccess(
          isFr
            ? "Le membre a été modifié avec succès."
            : "Member updated successfully."
        );
      } else {
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
          (isFr ? "Une erreur est survenue." : "An error occurred.")
      );
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (member) => {
    setDeletingMember(member);
    setShowDeleteConfirm(true);
    setSuccess("");
    setError("");
  };

  const closeDeleteConfirm = () => {
    if (deleting) return;
    setShowDeleteConfirm(false);
    setDeletingMember(null);
  };

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

  const getRoleLabel = (role) => {
    if (isFr) return role;
    return {
      Admin: "Admin",
      "Chef de projet": "Project manager",
      Membre: "Member",
    }[role] || role;
  };

  const getRoleIcon = (role) => {
    if (role === "Admin") return <ShieldCheck size={14} />;
    if (role === "Chef de projet") return <BriefcaseBusiness size={14} />;
    return <UserRound size={14} />;
  };

  return (
    <main className="team-page">
      <section className="team-hero">
        <div className="team-hero-content">
          <div className="team-eyebrow">
            <span className="team-eyebrow-dot" />
            TEAM WORKSPACE
          </div>

          <h1>
            {isFr ? "Les personnes derrière" : "The people behind"}
            <br />
            <span>{isFr ? "chaque projet." : "every project."}</span>
          </h1>

          <p>
            {isFr
              ? "Gérez votre équipe, découvrez les rôles et gardez tout le monde connecté."
              : "Manage your team, explore roles and keep everyone connected."}
          </p>

          <div className="team-hero-meta">
            <span><Users size={15} /> {members.length} {isFr ? "utilisateurs" : "people"}</span>
            <span className="team-meta-separator" />
            <span><UserCheck size={15} /> {isFr ? "Espace collaboratif" : "Collaborative workspace"}</span>
          </div>
        </div>

        <div className="team-hero-art" aria-hidden="true">
          <div className="team-art-orbit team-art-orbit-one" />
          <div className="team-art-orbit team-art-orbit-two" />
          <div className="team-art-center">
            <Users size={43} strokeWidth={1.5} />
          </div>
          <div className="team-art-person team-art-person-one"><UserRound size={21} /></div>
          <div className="team-art-person team-art-person-two"><Crown size={20} /></div>
          <div className="team-art-person team-art-person-three"><BriefcaseBusiness size={20} /></div>
          <div className="team-art-spark team-art-spark-one">✦</div>
          <div className="team-art-spark team-art-spark-two">✧</div>
        </div>

        <div className="team-hero-actions">
          <button
            type="button"
            className="team-refresh-button"
            onClick={fetchMembers}
            disabled={loading}
            title={isFr ? "Actualiser" : "Refresh"}
          >
            <RefreshCw size={17} className={loading ? "team-spinning" : ""} />
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
      </section>

      {success && <div className="team-alert team-alert-success">{success}</div>}
      {error && <div className="team-alert team-alert-error">{error}</div>}

      <section className="team-overview">
        <div className="team-overview-heading">
          <div>
            <span className="team-section-kicker">{isFr ? "VOTRE ORGANISATION" : "YOUR ORGANIZATION"}</span>
            <h2>{isFr ? "Aperçu de l'équipe" : "Team overview"}</h2>
          </div>
          <span className="team-overview-total">
            <strong>{members.length}</strong>
            {isFr ? " personnes" : " people"}
          </span>
        </div>

        <div className="team-stats">
          <article className="team-stat-card team-stat-total">
            <div className="team-stat-top">
              <span className="team-stat-icon"><Users size={19} /></span>
              <span className="team-stat-caption">{isFr ? "Effectif" : "Headcount"}</span>
            </div>
            <strong>{members.length.toString().padStart(2, "0")}</strong>
            <span className="team-stat-description">{isFr ? "Membres de l'espace" : "Workspace members"}</span>
          </article>

          <article className="team-stat-card">
            <div className="team-stat-top">
              <span className="team-stat-icon team-stat-icon-green"><UserRound size={19} /></span>
              <span className="team-stat-caption">{isFr ? "Collaborateurs" : "Members"}</span>
            </div>
            <strong>{memberCount.toString().padStart(2, "0")}</strong>
            <span className="team-stat-description">{isFr ? "Rôle membre" : "Member role"}</span>
          </article>

          <article className="team-stat-card">
            <div className="team-stat-top">
              <span className="team-stat-icon team-stat-icon-purple"><BriefcaseBusiness size={19} /></span>
              <span className="team-stat-caption">{isFr ? "Responsables" : "Managers"}</span>
            </div>
            <strong>{managerCount.toString().padStart(2, "0")}</strong>
            <span className="team-stat-description">{isFr ? "Chefs de projet" : "Project managers"}</span>
          </article>

          <article className="team-stat-card">
            <div className="team-stat-top">
              <span className="team-stat-icon team-stat-icon-orange"><ShieldCheck size={19} /></span>
              <span className="team-stat-caption">{isFr ? "Administration" : "Administration"}</span>
            </div>
            <strong>{adminCount.toString().padStart(2, "0")}</strong>
            <span className="team-stat-description">{isFr ? "Administrateurs" : "Administrators"}</span>
          </article>
        </div>
      </section>

      <section className="team-directory">
        <div className="team-directory-heading">
          <div>
            <span className="team-section-kicker">{isFr ? "COLLABORATION" : "COLLABORATION"}</span>
            <h2>{isFr ? "Annuaire de l'équipe" : "Team directory"}</h2>
            <p>{isFr ? "Retrouvez les personnes de votre espace de travail." : "Find the people in your workspace."}</p>
          </div>
          <div className="team-directory-count">
            <span>{filteredMembers.length}</span>
            {isFr ? " résultats" : " results"}
          </div>
        </div>

        <div className="team-toolbar">
          <label className="team-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={isFr ? "Rechercher par nom, email ou rôle..." : "Search by name, email or role..."}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label={isFr ? "Effacer la recherche" : "Clear search"}>
                <X size={15} />
              </button>
            )}
          </label>

          <select
            className="team-role-filter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label={isFr ? "Filtrer par rôle" : "Filter by role"}
          >
            <option value="Tous">{isFr ? "Tous les rôles" : "All roles"}</option>
            <option value="Admin">Admin</option>
            <option value="Chef de projet">{isFr ? "Chef de projet" : "Project manager"}</option>
            <option value="Membre">{isFr ? "Membre" : "Member"}</option>
          </select>
        </div>

        {loading ? (
          <div className="team-state">
            <span className="team-loader" />
            <p>{isFr ? "Chargement de votre équipe..." : "Loading your team..."}</p>
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="team-grid">
            {filteredMembers.map((member) => (
              <article className="team-member-card" key={member.id}>
                <div className="team-card-top">
                  <span className="team-avatar" style={{ backgroundColor: member.color, color: member.textColor }}>
                    {member.initials || <UserRound size={23} />}
                  </span>

                  {isAdmin && (
                    <div className="team-card-actions">
                      <button type="button" onClick={() => openEditForm(member)} title={isFr ? "Modifier" : "Edit"} aria-label={isFr ? "Modifier" : "Edit"}>
                        <Pencil size={15} />
                      </button>
                      {String(member.id) !== String(currentUser?.id) && (
                        <button className="team-delete-action" type="button" onClick={() => openDeleteConfirm(member)} title={isFr ? "Supprimer" : "Delete"} aria-label={isFr ? "Supprimer" : "Delete"}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="team-card-identity">
                  <h3>{member.name}</h3>
                  <span className="team-card-email"><Mail size={14} /> {member.email}</span>
                </div>

                <div className="team-card-footer">
                  <span className={`team-role-badge ${roleClasses[member.role] || "team-role-member"}`}>
                    {getRoleIcon(member.role)}
                    {getRoleLabel(member.role)}
                  </span>
                  <span className="team-card-id">ID #{member.id}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="team-state team-empty">
            <span className="team-empty-icon"><Users size={25} /></span>
            <h3>{isFr ? "Aucun membre trouvé" : "No members found"}</h3>
            <p>
              {search || roleFilter !== "Tous"
                ? isFr ? "Essayez de modifier votre recherche ou votre filtre." : "Try changing your search or filter."
                : isFr ? "Votre équipe apparaîtra ici." : "Your team members will appear here."}
            </p>
            {(search || roleFilter !== "Tous") && (
              <button type="button" onClick={() => { setSearch(""); setRoleFilter("Tous"); }}>
                {isFr ? "Réinitialiser les filtres" : "Reset filters"}
              </button>
            )}
          </div>
        )}
      </section>

      {showForm && isAdmin && (
        <div
          className="team-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section className="team-modal" role="dialog" aria-modal="true" aria-labelledby="team-modal-title">
            <header className="team-modal-header">
              <div className="team-modal-heading-icon"><UserPlus size={21} /></div>
              <div className="team-modal-heading-text">
                <h2 id="team-modal-title">
                  {editingMember
                    ? isFr ? "Modifier le membre" : "Edit member"
                    : isFr ? "Ajouter un membre" : "Add a member"}
                </h2>
                <p>
                  {editingMember
                    ? isFr ? "Mettez à jour les informations du membre." : "Update this member's information."
                    : isFr ? "Ajoutez une nouvelle personne à votre équipe." : "Add a new person to your team."}
                </p>
              </div>
              <button type="button" className="team-modal-close" onClick={closeForm} disabled={saving} aria-label={isFr ? "Fermer" : "Close"}>
                <X size={19} />
              </button>
            </header>

            <form className="team-form" onSubmit={handleSubmit}>
              <label>
                <span>{isFr ? "Nom complet" : "Full name"}</span>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder={isFr ? "Ex. Sara Amrani" : "e.g. Sara Amrani"}
                />
              </label>

              <label>
                <span>{isFr ? "Adresse e-mail" : "Email address"}</span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder="nom@exemple.com"
                />
              </label>

              {!editingMember && (
                <>
                  <label>
                    <span>{isFr ? "Mot de passe" : "Password"}</span>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                      placeholder={isFr ? "Minimum 8 caractères" : "Minimum 8 characters"}
                    />
                  </label>

                  <label>
                    <span>{isFr ? "Confirmer le mot de passe" : "Confirm password"}</span>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={formData.password_confirmation}
                      onChange={(event) => setFormData({ ...formData, password_confirmation: event.target.value })}
                      placeholder={isFr ? "Répétez le mot de passe" : "Repeat the password"}
                    />
                  </label>
                </>
              )}

              <label>
                <span>{isFr ? "Rôle dans l'équipe" : "Team role"}</span>
                <select value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })}>
                  <option value="Membre">{isFr ? "Membre" : "Member"}</option>
                  <option value="Chef de projet">{isFr ? "Chef de projet" : "Project manager"}</option>
                </select>
              </label>

              {formError && <p className="team-form-error">{formError}</p>}

              <footer className="team-form-actions">
                <button type="button" className="team-cancel-button" onClick={closeForm} disabled={saving}>
                  {isFr ? "Annuler" : "Cancel"}
                </button>
                <button type="submit" className="team-submit-button" disabled={saving}>
                  {saving ? (
                    <><span className="team-button-loader" />{isFr ? "Enregistrement..." : "Saving..."}</>
                  ) : (
                    <>{editingMember ? <Pencil size={16} /> : <Plus size={17} />}{editingMember ? isFr ? "Enregistrer" : "Save changes" : isFr ? "Ajouter le membre" : "Add member"}</>
                  )}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {showDeleteConfirm && deletingMember && (
        <div
          className="team-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDeleteConfirm();
          }}
        >
          <section className="team-modal team-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-member-title">
            <div className="team-delete-icon"><Trash2 size={23} /></div>
            <button type="button" className="team-modal-close team-delete-close" onClick={closeDeleteConfirm} disabled={deleting} aria-label={isFr ? "Fermer" : "Close"}>
              <X size={19} />
            </button>

            <h2 id="delete-member-title">{isFr ? "Supprimer ce membre ?" : "Delete this member?"}</h2>
            <p className="team-delete-description">
              {isFr
                ? "Cette action supprimera définitivement cet utilisateur de votre équipe."
                : "This action will permanently remove this user from your team."}
            </p>

            <div className="team-delete-person">
              <span className="team-avatar" style={{ backgroundColor: deletingMember.color, color: deletingMember.textColor }}>
                {deletingMember.initials}
              </span>
              <div>
                <strong>{deletingMember.name}</strong>
                <span>{deletingMember.email}</span>
              </div>
            </div>

            <footer className="team-form-actions">
              <button type="button" className="team-cancel-button" onClick={closeDeleteConfirm} disabled={deleting}>
                {isFr ? "Annuler" : "Cancel"}
              </button>
              <button type="button" className="team-delete-confirm-button" onClick={handleDeleteMember} disabled={deleting}>
                <Trash2 size={16} />
                {deleting ? isFr ? "Suppression..." : "Deleting..." : isFr ? "Supprimer" : "Delete"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
