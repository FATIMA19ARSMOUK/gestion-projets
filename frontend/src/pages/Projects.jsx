
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import {
  FolderKanban,
  Plus,
  Search,
  CalendarDays,
  Users,
  ArrowUpRight,
  X,
  Pencil,
  Trash2,
  UserPlus,
  UserRoundMinus,
  LogOut,
} from "lucide-react";
import "./Projects.css";

// Couleurs des projets
const colors = ["#6366f1", "#0d9488", "#f59e0b", "#8b5cf6"];

// Classes des statuts
const statusClasses = {
  "En cours": "project-status-progress",
  "À faire": "project-status-todo",
  "À venir": "project-status-todo",
  "Terminé": "project-status-done",
};

const emptyForm = {
  name: "",
  description: "",
  status: "À faire",
  priority: "Moyenne",
  deadline: "",
};

// Formater un projet reçu depuis Laravel
const formatProject = (project, index) => {
  const members = project.members || [];

  return {
    ...project,
    status: project.status === "À venir" ? "À faire" : project.status,
    deadline: project.end_date || "",
    color: colors[index % colors.length],
    progress: project.status === "Terminé" ? 100 : 0,
    memberList: members,
    initials: members.map((member) =>
      (member.name || "")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    ),
    members: members.length,
  };
};

export default function Projects() {
  const { language } = useOutletContext() || {};
  const isFr = language !== "en";

  // Informations de l'utilisateur connecté
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const userRole =
    typeof user?.role === "object"
      ? user.role?.name
      : user?.role;

  const isAdmin = userRole === "Admin";
  const isChef = userRole === "Chef de projet";
  const canCreateProject = isAdmin || isChef;

  // États des projets
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

  // États du formulaire projet
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [loadError, setLoadError] = useState("");

  // États de gestion des membres
  const [membersProject, setMembersProject] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState("");
  const [membersSuccess, setMembersSuccess] = useState("");
  const [memberActionLoading, setMemberActionLoading] = useState(false);

  // Charger les projets depuis Laravel
  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadError("");

        const data = await apiRequest("/projects");

        setProjects(
          data.map((project, index) =>
            formatProject(project, index)
          )
        );
      } catch (error) {
        console.error("Erreur de chargement des projets :", error);
        setLoadError(
          error.message || "Erreur de chargement des projets"
        );
      }
    }

    loadProjects();
  }, []);

  // Ouvrir la gestion des membres
  const openMembersModal = async (project) => {
    setMembersProject(project);
    setAvailableUsers([]);
    setSelectedUserId("");
    setMembersError("");
    setMembersSuccess("");
    setMembersLoading(true);

    try {
      const users = await apiRequest(
        `/projects/${project.id}/available-members`
      );

      setAvailableUsers(Array.isArray(users) ? users : []);
    } catch (error) {
      setMembersError(
        error.message ||
          (isFr
            ? "Erreur lors du chargement des utilisateurs."
            : "Error loading users.")
      );
    } finally {
      setMembersLoading(false);
    }
  };

  // Actualiser les informations du projet après modification des membres
  const refreshProjectMembers = (updatedProject) => {
    if (!updatedProject) return;

    setProjects((previous) =>
      previous.map((project, index) =>
        project.id === updatedProject.id
          ? {
              ...formatProject(updatedProject, index),
              color: project.color,
            }
          : project
      )
    );

    setMembersProject((previous) => ({
      ...formatProject(updatedProject, 0),
      color: previous?.color || colors[0],
    }));
  };

  // Ajouter un membre
  const handleAddMember = async () => {
    if (!selectedUserId || !membersProject || memberActionLoading) {
      return;
    }

    setMemberActionLoading(true);
    setMembersError("");
    setMembersSuccess("");

    try {
      const result = await apiRequest(
        `/projects/${membersProject.id}/members`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: Number(selectedUserId),
          }),
        }
      );

      refreshProjectMembers(result.project);

      const users = await apiRequest(
        `/projects/${membersProject.id}/available-members`
      );

      setAvailableUsers(Array.isArray(users) ? users : []);
      setSelectedUserId("");

      setMembersSuccess(
        isFr
          ? "Membre ajouté avec succès."
          : "Member added successfully."
      );
    } catch (error) {
      setMembersError(
        error.message ||
          (isFr
            ? "Erreur lors de l'ajout du membre."
            : "Error adding member.")
      );
    } finally {
      setMemberActionLoading(false);
    }
  };

  // Retirer un membre
  const handleRemoveMember = async (memberId) => {
    if (!membersProject || memberActionLoading) return;

    const confirmed = window.confirm(
      isFr
        ? "Voulez-vous vraiment retirer ce membre du projet ?"
        : "Are you sure you want to remove this member?"
    );

    if (!confirmed) return;

    setMemberActionLoading(true);
    setMembersError("");
    setMembersSuccess("");

    try {
      const result = await apiRequest(
        `/projects/${membersProject.id}/members/${memberId}`,
        {
          method: "DELETE",
        }
      );

      refreshProjectMembers(result.project);

      const users = await apiRequest(
        `/projects/${membersProject.id}/available-members`
      );

      setAvailableUsers(Array.isArray(users) ? users : []);

      setMembersSuccess(
        isFr
          ? "Membre retiré avec succès."
          : "Member removed successfully."
      );
    } catch (error) {
      setMembersError(
        error.message ||
          (isFr
            ? "Erreur lors du retrait du membre."
            : "Error removing member.")
      );
    } finally {
      setMemberActionLoading(false);
    }
  };

  // Un membre quitte un projet
  const handleLeaveProject = async (project) => {
    const confirmed = window.confirm(
      isFr
        ? `Voulez-vous vraiment quitter le projet "${project.name}" ?`
        : `Are you sure you want to leave "${project.name}"?`
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/projects/${project.id}/leave`, {
        method: "DELETE",
      });

      // Retirer le projet de la liste affichée
      setProjects((previous) =>
        previous.filter((item) => item.id !== project.id)
      );

      window.alert(
        isFr
          ? "Vous avez quitté le projet avec succès."
          : "You have successfully left the project."
      );
    } catch (error) {
      window.alert(
        error.message ||
          (isFr
            ? "Erreur lors de la sortie du projet."
            : "Error leaving the project.")
      );
    }
  };

  // Fermer la gestion des membres
  const closeMembersModal = () => {
    if (memberActionLoading) return;

    setMembersProject(null);
    setAvailableUsers([]);
    setSelectedUserId("");
    setMembersError("");
    setMembersSuccess("");
  };

  // Recherche et filtrage
  const filteredProjects = projects.filter((project) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      (project.name || "").toLowerCase().includes(searchTerm) ||
      (project.description || "").toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "Tous" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistiques
  const activeProjects = projects.filter(
    (project) => project.status === "En cours"
  ).length;

  const totalMembers = new Set(
    projects.flatMap((project) => project.initials || [])
  ).size;

  // Formatage des dates
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T12:00:00`).toLocaleDateString(
      isFr ? "fr-FR" : "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // Ouvrir le formulaire de création
  const openModal = () => {
    setEditingProject(null);
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  // Ouvrir le formulaire de modification
  const openEditModal = (project) => {
    setEditingProject(project);

    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "À faire",
      priority: project.priority || "Moyenne",
      deadline: project.end_date || project.deadline || "",
    });

    setFormError("");
    setIsModalOpen(true);
  };

  // Fermer le formulaire
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(emptyForm);
    setFormError("");
  };

  // Modifier les champs du formulaire
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formError) setFormError("");
  };

  // Préparer les données envoyées à Laravel
  const getProjectPayload = () => ({
    name: formData.name.trim(),
    description: formData.description.trim(),
    status:
      formData.status === "À faire"
        ? "À venir"
        : formData.status,
    end_date: formData.deadline,
  });

  // Validation du formulaire
  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.deadline
    ) {
      setFormError(
        isFr
          ? "Veuillez remplir tous les champs obligatoires."
          : "Please fill in all required fields."
      );

      return false;
    }

    return true;
  };

  // Créer un projet
  const handleCreateProject = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setFormError("");

      const result = await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(getProjectPayload()),
      });

      const formattedProject = formatProject(
        result.project,
        projects.length
      );

      setProjects((previous) => [
        formattedProject,
        ...previous,
      ]);

      setSearch("");
      setStatusFilter("Tous");
      closeModal();
    } catch (error) {
      setFormError(
        error.message ||
          (isFr
            ? "Une erreur est survenue."
            : "Something went wrong.")
      );
    }
  };

  // Modifier un projet
  const handleUpdateProject = async (event) => {
    event.preventDefault();

    if (!validateForm() || !editingProject) return;

    try {
      setFormError("");

      const result = await apiRequest(
        `/projects/${editingProject.id}`,
        {
          method: "PUT",
          body: JSON.stringify(getProjectPayload()),
        }
      );

      const updatedProject = {
        ...formatProject(result.project, 0),
        color: editingProject.color,
      };

      setProjects((previous) =>
        previous.map((project) =>
          project.id === editingProject.id
            ? updatedProject
            : project
        )
      );

      closeModal();
    } catch (error) {
      setFormError(
        error.message ||
          (isFr
            ? "Erreur lors de la modification."
            : "Error updating project.")
      );
    }
  };

  // Supprimer un projet
  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      isFr
        ? `Voulez-vous vraiment supprimer le projet "${project.name}" ?`
        : `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/projects/${project.id}`, {
        method: "DELETE",
      });

      setProjects((previous) =>
        previous.filter((item) => item.id !== project.id)
      );
    } catch (error) {
      window.alert(
        error.message ||
          (isFr
            ? "Erreur lors de la suppression."
            : "Error deleting project.")
      );
    }
  };

  return (
    <main className="projects-page">
      {/* En-tête */}
      <header className="projects-header">
        <div>
          <div className="projects-eyebrow">
            <FolderKanban size={15} />
            {isFr ? "ESPACE DE TRAVAIL" : "WORKSPACE"}
          </div>

          <h1>{isFr ? "Projets" : "Projects"}</h1>

          <p>
            {isFr
              ? "Organisez vos projets et suivez leur progression."
              : "Organize your projects and track their progress."}
          </p>
        </div>

        {canCreateProject && (
          <button
            className="projects-create-button"
            type="button"
            onClick={openModal}
          >
            <Plus size={18} />
            {isFr ? "Nouveau projet" : "New project"}
          </button>
        )}
      </header>

      {/* Statistiques */}
      <section className="projects-summary">
        <article className="projects-summary-card">
          <span className="summary-icon summary-icon-blue">
            <FolderKanban size={19} />
          </span>

          <div>
            <p>{isFr ? "Total des projets" : "Total projects"}</p>
            <strong>{projects.length}</strong>
          </div>
        </article>

        <article className="projects-summary-card">
          <span className="summary-icon summary-icon-green">
            <ArrowUpRight size={19} />
          </span>

          <div>
            <p>{isFr ? "En cours" : "In progress"}</p>
            <strong>{activeProjects}</strong>
          </div>
        </article>

        <article className="projects-summary-card">
          <span className="summary-icon summary-icon-purple">
            <Users size={19} />
          </span>

          <div>
            <p>{isFr ? "Membres impliqués" : "Members involved"}</p>
            <strong>{totalMembers}</strong>
          </div>
        </article>
      </section>

      {/* Recherche et filtre */}
      <section className="projects-toolbar">
        <label className="projects-search">
          <Search size={18} />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              isFr
                ? "Rechercher un projet..."
                : "Search projects..."
            }
            aria-label={
              isFr ? "Rechercher un projet" : "Search projects"
            }
          />
        </label>

        <select
          className="projects-filter-button"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label={
            isFr ? "Filtrer par statut" : "Filter by status"
          }
        >
          <option value="Tous">
            {isFr ? "Tous les statuts" : "All statuses"}
          </option>

          <option value="En cours">
            {isFr ? "En cours" : "In progress"}
          </option>

          <option value="À faire">
            {isFr ? "À faire" : "To do"}
          </option>

          <option value="Terminé">
            {isFr ? "Terminé" : "Completed"}
          </option>
        </select>
      </section>

      {/* Erreur de chargement */}
      {loadError && (
        <p style={{ color: "red", margin: "16px 0" }}>
          {isFr ? "Erreur :" : "Error:"} {loadError}
        </p>
      )}

      {/* Liste des projets */}
      <section className="projects-grid">
        {filteredProjects.map((project) => {
          const canEdit =
            isAdmin ||
            (isChef &&
              String(project.created_by) === String(user?.id));

          const canManageMembers =
            isAdmin ||
            (isChef &&
              String(project.created_by) === String(user?.id));

          const isProjectMember = project.memberList?.some(
            (member) => String(member.id) === String(user?.id)
          );

          const canLeaveProject =
            !isAdmin && !isChef && isProjectMember;

          return (
            <article className="project-card" key={project.id}>
              <div className="project-card-top">
                <span
                  className="project-folder-icon"
                  style={{
                    backgroundColor: `${project.color}18`,
                    color: project.color,
                  }}
                >
                  <FolderKanban size={21} />
                </span>

                <div className="project-card-actions">
                  <span
                    className={`project-status ${
                      statusClasses[project.status] || ""
                    }`}
                  >
                    {isFr
                      ? project.status
                      : {
                          "En cours": "In progress",
                          "À faire": "To do",
                          "Terminé": "Completed",
                        }[project.status] || project.status}
                  </span>

                  {canEdit && (
                    <button
                      type="button"
                      className="project-action-button"
                      title={isFr ? "Modifier" : "Edit"}
                      aria-label={isFr ? "Modifier le projet" : "Edit project"}
                      onClick={() => openEditModal(project)}
                    >
                      <Pencil size={16} />
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      type="button"
                      className="project-action-button project-delete-button"
                      title={isFr ? "Supprimer" : "Delete"}
                      aria-label={
                        isFr ? "Supprimer le projet" : "Delete project"
                      }
                      onClick={() => handleDeleteProject(project)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <h2>{project.name}</h2>

              <p className="project-description">
                {project.description}
              </p>

              <div className="project-progress-heading">
                <span>{isFr ? "Progression" : "Progress"}</span>
                <strong>{project.progress}%</strong>
              </div>

              <div
                className="project-progress-track"
                role="progressbar"
                aria-label={
                  isFr ? "Progression du projet" : "Project progress"
                }
                aria-valuenow={project.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="project-progress-fill"
                  style={{
                    width: `${project.progress}%`,
                    backgroundColor: project.color,
                  }}
                />
              </div>

              <div className="project-card-footer">
                <div
                  className="project-avatars"
                  aria-label={`${project.members} members`}
                >
                  {project.initials.map((initial, index) => (
                  <span
                    key={`${project.id}-${initial}-${index}`}
                    style={{ zIndex: 3 - index }}
                    title={project.memberList[index]?.name || initial}
                  >
                    {initial}
                  </span>
                ))}

                  {project.members > project.initials.length && (
                    <span className="project-avatar-more">
                      +{project.members - project.initials.length}
                    </span>
                  )}
                </div>

                <div className="project-deadline">
                  <CalendarDays size={15} />
                  {formatDate(project.deadline)}
                </div>
              </div>

              {canManageMembers && (
                <button
                  type="button"
                  className="project-manage-members-button"
                  onClick={() => openMembersModal(project)}
                >
                  <Users size={15} />
                  {isFr ? "Gérer les membres" : "Manage members"}
                </button>
              )}

              {canLeaveProject && (
                <button
                  type="button"
                  className="project-manage-members-button"
                  onClick={() => handleLeaveProject(project)}
                >
                  <LogOut size={15} />
                  {isFr ? "Quitter le projet" : "Leave project"}
                </button>
              )}
            </article>
          );
        })}
      </section>

      {filteredProjects.length === 0 && (
        <p className="projects-demo-note">
          {isFr ? "Aucun projet trouvé." : "No projects found."}
        </p>
      )}

      {/* Modal de création et modification */}
      {isModalOpen && (
        <div
          className="project-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(15, 23, 42, 0.65)",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="project-form-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-form-title"
          >
            <header className="project-form-header">
              <div>
                <span className="project-form-eyebrow">
                  {isFr ? "ESPACE DE TRAVAIL" : "WORKSPACE"}
                </span>

                <h2 id="project-form-title">
                  {editingProject
                    ? isFr
                      ? "Modifier le projet"
                      : "Edit project"
                    : isFr
                      ? "Créer un projet"
                      : "Create a project"}
                </h2>

                <p>
                  {editingProject
                    ? isFr
                      ? "Modifiez les informations de votre projet."
                      : "Update your project information."
                    : isFr
                      ? "Renseignez les informations de votre projet."
                      : "Enter your project information."}
                </p>
              </div>

              <button
                type="button"
                className="project-form-close"
                onClick={closeModal}
                aria-label={isFr ? "Fermer" : "Close"}
              >
                <X size={20} />
              </button>
            </header>

            <form
              className="project-form"
              onSubmit={
                editingProject
                  ? handleUpdateProject
                  : handleCreateProject
              }
            >
              <label className="project-form-field">
                <span>
                  {isFr ? "Nom du projet *" : "Project name *"}
                </span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={
                    isFr
                      ? "Ex. Refonte du site web"
                      : "e.g. Website redesign"
                  }
                  maxLength={100}
                  required
                  autoFocus
                />
              </label>

              <label className="project-form-field">
                <span>
                  {isFr ? "Description *" : "Description *"}
                </span>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={
                    isFr
                      ? "Décrivez brièvement votre projet..."
                      : "Briefly describe your project..."
                  }
                  rows={3}
                  maxLength={1000}
                  required
                />
              </label>

              <div className="project-form-two-columns">
                <label className="project-form-field">
                  <span>{isFr ? "Statut" : "Status"}</span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="À faire">
                      {isFr ? "À faire" : "To do"}
                    </option>

                    <option value="En cours">
                      {isFr ? "En cours" : "In progress"}
                    </option>

                    <option value="Terminé">
                      {isFr ? "Terminé" : "Completed"}
                    </option>
                  </select>
                </label>

                <label className="project-form-field">
                  <span>{isFr ? "Priorité" : "Priority"}</span>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="Basse">
                      {isFr ? "Basse" : "Low"}
                    </option>

                    <option value="Moyenne">
                      {isFr ? "Moyenne" : "Medium"}
                    </option>

                    <option value="Haute">
                      {isFr ? "Haute" : "High"}
                    </option>
                  </select>
                </label>
              </div>

              <label className="project-form-field">
                <span>
                  {isFr ? "Date limite *" : "Deadline *"}
                </span>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </label>

              {formError && (
                <p className="project-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="project-form-actions">
                <button
                  type="button"
                  className="project-form-cancel"
                  onClick={closeModal}
                >
                  {isFr ? "Annuler" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="project-form-submit"
                >
                  {editingProject ? (
                    <Pencil size={17} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {editingProject
                    ? isFr
                      ? "Enregistrer les modifications"
                      : "Save changes"
                    : isFr
                      ? "Créer le projet"
                      : "Create project"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Modal de gestion des membres */}
      {membersProject && (
        <div
          className="project-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(15, 23, 42, 0.65)",
          }}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !memberActionLoading
            ) {
              closeMembersModal();
            }
          }}
        >
          <section
            className="members-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="members-modal-title"
          >
            <header className="project-form-header">
              <div>
                <span className="project-form-eyebrow">
                  {isFr ? "ESPACE DE TRAVAIL" : "WORKSPACE"}
                </span>

                <h2 id="members-modal-title">
                  {isFr ? "Gestion des membres" : "Manage members"}
                </h2>

                <p>{membersProject.name}</p>
              </div>

              <button
                type="button"
                className="project-form-close"
                onClick={closeMembersModal}
                disabled={memberActionLoading}
                aria-label={isFr ? "Fermer" : "Close"}
              >
                <X size={20} />
              </button>
            </header>

            <div className="members-modal-body">
              {/* Membres actuels */}
              <section>
                <h3 className="members-section-title">
                  {isFr
                    ? `Membres actuels (${membersProject.members})`
                    : `Current members (${membersProject.members})`}
                </h3>

                {membersProject.memberList?.length > 0 ? (
                  <div className="members-list">
                    {membersProject.memberList.map((member) => (
                      <div className="member-row" key={member.id}>
                        <div className="member-info">
                          <span className="member-avatar">
                            {(member.name || "?")
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>

                          <div className="member-details">
                            <strong>{member.name}</strong>
                            <span>{member.email}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="member-remove-button"
                          title={isFr ? "Retirer" : "Remove"}
                          aria-label={
                            isFr
                              ? `Retirer ${member.name}`
                              : `Remove ${member.name}`
                          }
                          disabled={memberActionLoading}
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <UserRoundMinus size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="members-empty">
                    {isFr
                      ? "Aucun membre dans ce projet."
                      : "No members in this project."}
                  </p>
                )}
              </section>

              {/* Ajouter un membre */}
              <section>
                <h3 className="members-section-title">
                  {isFr ? "Ajouter un membre" : "Add a member"}
                </h3>

                {membersLoading ? (
                  <p className="members-empty">
                    {isFr
                      ? "Chargement des utilisateurs..."
                      : "Loading users..."}
                  </p>
                ) : (
                  <div className="member-add-form">
                    <select
                      value={selectedUserId}
                      onChange={(event) =>
                        setSelectedUserId(event.target.value)
                      }
                      disabled={
                        memberActionLoading ||
                        availableUsers.length === 0
                      }
                    >
                      <option value="">
                        {isFr
                          ? "Choisir un utilisateur"
                          : "Select a user"}
                      </option>

                      {availableUsers.map((availableUser) => (
                        <option
                          key={availableUser.id}
                          value={availableUser.id}
                        >
                          {availableUser.name} — {availableUser.email}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="member-add-button"
                      onClick={handleAddMember}
                      disabled={
                        !selectedUserId ||
                        memberActionLoading ||
                        membersLoading
                      }
                    >
                      <UserPlus size={16} />

                      {memberActionLoading
                        ? isFr
                          ? "Patientez..."
                          : "Please wait..."
                        : isFr
                          ? "Ajouter"
                          : "Add"}
                    </button>
                  </div>
                )}

                {!membersLoading && availableUsers.length === 0 && (
                  <p className="members-empty">
                    {isFr
                      ? "Aucun utilisateur disponible à ajouter."
                      : "No available users to add."}
                  </p>
                )}
              </section>

              {/* Messages */}
              {membersError && (
                <p className="members-feedback error" role="alert">
                  {membersError}
                </p>
              )}

              {membersSuccess && (
                <p className="members-feedback success" role="status">
                  {membersSuccess}
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
