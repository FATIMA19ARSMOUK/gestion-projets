
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CheckSquare,
  Search,
  Plus,
  CalendarDays,
  Circle,
  Clock3,
  CheckCircle2,
  Flag,
  MessageSquare,
  X,
  Send,
} from "lucide-react";
import { apiRequest } from "../services/api";
import "./Tasks.css";

const statusClass = {
  "À faire": "task-status-todo",
  "En cours": "task-status-progress",
  "Terminé": "task-status-done",
};

const priorityClass = {
  Haute: "task-priority-high",
  Moyenne: "task-priority-medium",
  Basse: "task-priority-low",
  Urgente: "task-priority-high",
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "—";

const formatDate = (date) => {
  if (!date) return "—";

  const datePart = String(date).slice(0, 10);
  const parsedDate = new Date(`${datePart}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTask = (task) => ({
  ...task,
  project: task.project?.name || "—",
  assignee: task.assignee?.name
    ? getInitials(task.assignee.name)
    : "—",
  assigneeName: task.assignee?.name || "Non assignée",
  dueDate: formatDate(task.deadline),
});

const formatComment = (comment) => ({
  id: comment.id,
  author: comment.user?.name || "Utilisateur",
  initials: getInitials(comment.user?.name),
  text: comment.content,
  date: comment.created_at
    ? new Date(comment.created_at).toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "",
});

const initialForm = {
  project_id: "",
  title: "",
  description: "",
  assigned_to: "",
  status: "À faire",
  priority: "Moyenne",
  deadline: "",
};

export default function Tasks() {
  const { language } = useOutletContext() || {};
  const isFr = language !== "en";

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [priorityFilter, setPriorityFilter] = useState("Toutes");

  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [commentError, setCommentError] = useState("");

  // Charger les tâches et les projets depuis Laravel
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [tasksData, projectsData] = await Promise.all([
        apiRequest("/tasks"),
        apiRequest("/projects"),
      ]);

      setTasks(
        Array.isArray(tasksData)
          ? tasksData.map(formatTask)
          : []
      );

      setProjects(
        Array.isArray(projectsData) ? projectsData : []
      );
    } catch (err) {
      console.error("Erreur chargement tâches :", err);
      setError(
        err.message ||
          (isFr
            ? "Impossible de charger les données."
            : "Unable to load data.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Charger les commentaires de la tâche sélectionnée
  useEffect(() => {
    if (!selectedTask) {
      setComments([]);
      return;
    }

    let active = true;

    const loadComments = async () => {
      setLoadingComments(true);
      setCommentError("");

      try {
        const data = await apiRequest(
          `/tasks/${selectedTask.id}/comments`
        );

        if (active) {
          setComments(
            Array.isArray(data) ? data.map(formatComment) : []
          );
        }
      } catch (err) {
        console.error("Erreur chargement commentaires :", err);

        if (active) {
          setCommentError(
            err.message ||
              (isFr
                ? "Impossible de charger les commentaires."
                : "Unable to load comments.")
          );
        }
      } finally {
        if (active) setLoadingComments(false);
      }
    };

    loadComments();

    return () => {
      active = false;
    };
  }, [selectedTask?.id]);

  // Recherche et filtres
  const normalizedSearch = search.toLowerCase().trim();

  const filteredTasks = tasks.filter((task) => {
    const searchableText = [
      task.title,
      task.project,
      task.assigneeName,
      task.status,
      task.priority,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchableText.includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "Tous" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "Toutes" ||
      task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Statistiques
  const counts = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "À faire").length,
    progress: tasks.filter((task) => task.status === "En cours").length,
    done: tasks.filter((task) => task.status === "Terminé").length,
  };

  // Membres du projet sélectionné
  const selectedProject = projects.find(
    (project) => String(project.id) === String(form.project_id)
  );

  const projectMembers = selectedProject?.members || [];

  // Créer une tâche
  const handleCreateTask = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.project_id || !form.title.trim()) {
      setFormError(
        isFr
          ? "Veuillez remplir le projet et le titre."
          : "Please select a project and enter a title."
      );
      return;
    }

    setSavingTask(true);

    try {
      const payload = {
        project_id: Number(form.project_id),
        title: form.title.trim(),
        description: form.description.trim() || null,
        assigned_to: form.assigned_to
          ? Number(form.assigned_to)
          : null,
        status: form.status,
        priority: form.priority,
        deadline: form.deadline || null,
      };

      const response = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.task) {
        setTasks((current) => [
          formatTask(response.task),
          ...current,
        ]);
      } else {
        await loadData();
      }

      setForm(initialForm);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Erreur création tâche :", err);
      setFormError(
        err.message ||
          (isFr
            ? "Impossible de créer la tâche."
            : "Unable to create task.")
      );
    } finally {
      setSavingTask(false);
    }
  };

  // Modifier le statut d'une tâche
  const updateStatus = async (id, status) => {
    const previousTask = tasks.find((task) => task.id === id);
    if (!previousTask || previousTask.status === status) return;

    setUpdatingTaskId(id);
    setError("");

    try {
      const response = await apiRequest(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      const updatedTask = response.task
        ? formatTask(response.task)
        : { ...previousTask, status };

      setTasks((current) =>
        current.map((task) =>
          task.id === id ? updatedTask : task
        )
      );

      setSelectedTask((current) =>
        current?.id === id ? updatedTask : current
      );
    } catch (err) {
      console.error("Erreur modification statut :", err);
      setError(
        err.message ||
          (isFr
            ? "Impossible de modifier le statut."
            : "Unable to update status.")
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Ajouter un commentaire
  const addComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim() || !selectedTask) return;

    setSendingComment(true);
    setCommentError("");

    try {
      const response = await apiRequest(
        `/tasks/${selectedTask.id}/comments`,
        {
          method: "POST",
          body: JSON.stringify({
            content: commentText.trim(),
          }),
        }
      );

      if (response.comment) {
        setComments((current) => [
          ...current,
          formatComment(response.comment),
        ]);
      }

      setCommentText("");
    } catch (err) {
      console.error("Erreur ajout commentaire :", err);
      setCommentError(
        err.message ||
          (isFr
            ? "Impossible d'ajouter le commentaire."
            : "Unable to add comment.")
      );
    } finally {
      setSendingComment(false);
    }
  };

  return (
    <main className="tasks-page">
      <header className="tasks-header">
        <div>
          <div className="tasks-eyebrow">
            <CheckSquare size={15} />
            {isFr ? "GESTION DU TRAVAIL" : "WORK MANAGEMENT"}
          </div>

          <h1>{isFr ? "Tâches" : "Tasks"}</h1>

          <p>
            {isFr
              ? "Organisez votre travail et suivez chaque étape."
              : "Organize your work and track every step."}
          </p>
        </div>

        <button
          type="button"
          className="tasks-create-button"
          onClick={() => {
            setForm(initialForm);
            setFormError("");
            setShowCreateModal(true);
          }}
        >
          <Plus size={18} />
          {isFr ? "Nouvelle tâche" : "New task"}
        </button>
      </header>

      {error && (
        <p className="tasks-error-message">{error}</p>
      )}

      <section className="tasks-summary">
        <article className="tasks-summary-card">
          <span className="tasks-summary-icon tasks-icon-blue">
            <CheckSquare size={19} />
          </span>
          <div>
            <p>{isFr ? "Toutes les tâches" : "All tasks"}</p>
            <strong>{counts.total}</strong>
          </div>
        </article>

        <article className="tasks-summary-card">
          <span className="tasks-summary-icon tasks-icon-orange">
            <Circle size={19} />
          </span>
          <div>
            <p>{isFr ? "À faire" : "To do"}</p>
            <strong>{counts.todo}</strong>
          </div>
        </article>

        <article className="tasks-summary-card">
          <span className="tasks-summary-icon tasks-icon-purple">
            <Clock3 size={19} />
          </span>
          <div>
            <p>{isFr ? "En cours" : "In progress"}</p>
            <strong>{counts.progress}</strong>
          </div>
        </article>

        <article className="tasks-summary-card">
          <span className="tasks-summary-icon tasks-icon-green">
            <CheckCircle2 size={19} />
          </span>
          <div>
            <p>{isFr ? "Terminées" : "Completed"}</p>
            <strong>{counts.done}</strong>
          </div>
        </article>
      </section>

      <section className="tasks-toolbar">
        <label className="tasks-search">
          <Search size={18} />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              isFr ? "Rechercher une tâche..." : "Search tasks..."
            }
          />
        </label>

        <select
          className="tasks-select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label={isFr ? "Filtrer par statut" : "Filter by status"}
        >
          <option value="Tous">
            {isFr ? "Tous les statuts" : "All statuses"}
          </option>
          <option value="À faire">{isFr ? "À faire" : "To do"}</option>
          <option value="En cours">
            {isFr ? "En cours" : "In progress"}
          </option>
          <option value="Terminé">
            {isFr ? "Terminé" : "Completed"}
          </option>
        </select>

        <select
          className="tasks-select"
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          aria-label={isFr ? "Filtrer par priorité" : "Filter by priority"}
        >
          <option value="Toutes">
            {isFr ? "Toutes les priorités" : "All priorities"}
          </option>
          <option value="Haute">
            {isFr ? "Haute priorité" : "High priority"}
          </option>
          <option value="Moyenne">
            {isFr ? "Priorité moyenne" : "Medium priority"}
          </option>
          <option value="Basse">
            {isFr ? "Basse priorité" : "Low priority"}
          </option>
          <option value="Urgente">
            {isFr ? "Urgente" : "Urgent"}
          </option>
        </select>
      </section>

      <section className="tasks-table-container">
        <div className="tasks-table-heading">
          <div>
            <h2>{isFr ? "Liste des tâches" : "Task list"}</h2>
            <p>
              {filteredTasks.length}{" "}
              {isFr ? "tâche(s) affichée(s)" : "task(s) displayed"}
            </p>
          </div>
        </div>

        <div className="tasks-table-scroll">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>{isFr ? "Tâche" : "Task"}</th>
                <th>{isFr ? "Projet" : "Project"}</th>
                <th>{isFr ? "Assignée à" : "Assignee"}</th>
                <th>{isFr ? "Statut" : "Status"}</th>
                <th>{isFr ? "Priorité" : "Priority"}</th>
                <th>{isFr ? "Échéance" : "Due date"}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="tasks-empty">
                    {isFr ? "Chargement des tâches..." : "Loading tasks..."}
                  </td>
                </tr>
              ) : (
                <>
                  {filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <div className="task-title-cell">
                          {task.status === "Terminé" ? (
                            <CheckCircle2
                              size={17}
                              className="task-completed-icon"
                            />
                          ) : (
                            <Circle
                              size={17}
                              className="task-circle-icon"
                            />
                          )}

                          <button
                            type="button"
                            className="task-title-button"
                            onClick={() => setSelectedTask(task)}
                          >
                            {task.title}
                          </button>
                        </div>
                      </td>

                      <td>
                        <span className="task-project-name">
                          {task.project}
                        </span>
                      </td>

                      <td>
                        <span className="task-assignee">
                          {task.assignee}
                        </span>
                      </td>

                      <td>
                        <select
                          className={`task-status-select ${statusClass[task.status] || ""}`}
                          value={task.status}
                          disabled={updatingTaskId === task.id}
                          onChange={(event) =>
                            updateStatus(task.id, event.target.value)
                          }
                          aria-label={`${isFr ? "Statut de" : "Status of"} ${task.title}`}
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
                      </td>

                      <td>
                        <span
                          className={`task-priority ${priorityClass[task.priority] || ""}`}
                        >
                          <Flag size={13} />
                          {isFr
                            ? task.priority
                            : {
                                Haute: "High",
                                Moyenne: "Medium",
                                Basse: "Low",
                                Urgente: "Urgent",
                              }[task.priority] || task.priority}
                        </span>
                      </td>

                      <td>
                        <span className="task-due-date">
                          <CalendarDays size={14} />
                          {task.dueDate}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="tasks-empty">
                        {isFr
                          ? "Aucune tâche trouvée."
                          : "No tasks found."}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal de création */}
      {showCreateModal && (
        <div
          className="task-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCreateModal(false);
            }
          }}
        >
          <section
            className="task-details-modal task-create-modal"
            role="dialog"
            aria-modal="true"
          >
            <header className="task-modal-header">
              <div>
                <span className="task-modal-eyebrow">
                  {isFr ? "GESTION DU TRAVAIL" : "WORK MANAGEMENT"}
                </span>
                <h2>
                  {isFr ? "Créer une nouvelle tâche" : "Create a new task"}
                </h2>
                <p>
                  {isFr
                    ? "Remplissez les informations de la tâche."
                    : "Enter the task information."}
                </p>
              </div>

              <button
                type="button"
                className="task-modal-close"
                onClick={() => setShowCreateModal(false)}
                aria-label={isFr ? "Fermer" : "Close"}
              >
                <X size={20} />
              </button>
            </header>

            <form
              className="task-create-form"
              onSubmit={handleCreateTask}
            >
              <label>
                {isFr ? "Projet *" : "Project *"}
                <select
                  required
                  value={form.project_id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      project_id: event.target.value,
                      assigned_to: "",
                    })
                  }
                >
                  <option value="">
                    {isFr ? "Sélectionner un projet" : "Select a project"}
                  </option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {isFr ? "Titre de la tâche *" : "Task title *"}
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder={
                    isFr ? "Ex : Créer la page d'accueil" : "e.g. Create homepage"
                  }
                />
              </label>

              <label>
                {isFr ? "Description" : "Description"}
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder={
                    isFr
                      ? "Décrivez la tâche..."
                      : "Describe the task..."
                  }
                />
              </label>

              <label>
                {isFr ? "Assigner à" : "Assign to"}
                <select
                  value={form.assigned_to}
                  onChange={(event) =>
                    setForm({ ...form, assigned_to: event.target.value })
                  }
                  disabled={!form.project_id}
                >
                  <option value="">
                    {isFr ? "Non assignée" : "Unassigned"}
                  </option>

                  {projectMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>

              {form.project_id && projectMembers.length === 0 && (
                <p className="task-form-hint">
                  {isFr
                    ? "Ce projet ne contient aucun membre."
                    : "This project has no members."}
                </p>
              )}

              <div className="task-form-grid">
                <label>
                  {isFr ? "Statut" : "Status"}
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option value="À faire">{isFr ? "À faire" : "To do"}</option>
                    <option value="En cours">
                      {isFr ? "En cours" : "In progress"}
                    </option>
                    <option value="Terminé">
                      {isFr ? "Terminé" : "Completed"}
                    </option>
                  </select>
                </label>

                <label>
                  {isFr ? "Priorité" : "Priority"}
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({ ...form, priority: event.target.value })
                    }
                  >
                    <option value="Basse">{isFr ? "Basse" : "Low"}</option>
                    <option value="Moyenne">
                      {isFr ? "Moyenne" : "Medium"}
                    </option>
                    <option value="Haute">{isFr ? "Haute" : "High"}</option>
                    <option value="Urgente">
                      {isFr ? "Urgente" : "Urgent"}
                    </option>
                  </select>
                </label>
              </div>

              <label>
                {isFr ? "Date limite" : "Deadline"}
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(event) =>
                    setForm({ ...form, deadline: event.target.value })
                  }
                />
              </label>

              {formError && (
                <p className="tasks-error-message">{formError}</p>
              )}

              <div className="task-create-actions">
                <button
                  type="button"
                  className="task-cancel-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  {isFr ? "Annuler" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="tasks-create-button"
                  disabled={savingTask}
                >
                  <Plus size={17} />
                  {savingTask
                    ? isFr
                      ? "Création..."
                      : "Creating..."
                    : isFr
                      ? "Créer la tâche"
                      : "Create task"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Modal des détails et commentaires */}
      {selectedTask && (
        <div
          className="task-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTask(null);
            }
          }}
        >
          <section
            className="task-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
          >
            <header className="task-modal-header">
              <div>
                <span className="task-modal-eyebrow">
                  {isFr ? "DÉTAILS DE LA TÂCHE" : "TASK DETAILS"}
                </span>

                <h2 id="task-modal-title">{selectedTask.title}</h2>
                <p>{selectedTask.project}</p>
              </div>

              <button
                type="button"
                className="task-modal-close"
                onClick={() => setSelectedTask(null)}
                aria-label={isFr ? "Fermer" : "Close"}
              >
                <X size={20} />
              </button>
            </header>

            {selectedTask.description && (
              <div className="task-modal-description">
                <strong>{isFr ? "Description" : "Description"}</strong>
                <p>{selectedTask.description}</p>
              </div>
            )}

            <div className="task-modal-meta">
              <div>
                <span>{isFr ? "Statut" : "Status"}</span>
                <strong>{selectedTask.status}</strong>
              </div>

              <div>
                <span>{isFr ? "Priorité" : "Priority"}</span>
                <strong>{selectedTask.priority}</strong>
              </div>

              <div>
                <span>{isFr ? "Assignée à" : "Assignee"}</span>
                <strong>{selectedTask.assigneeName}</strong>
              </div>

              <div>
                <span>{isFr ? "Échéance" : "Due date"}</span>
                <strong>{selectedTask.dueDate}</strong>
              </div>
            </div>

            <div className="task-comments-section">
              <div className="task-comments-heading">
                <MessageSquare size={18} />
                <h3>{isFr ? "Commentaires" : "Comments"}</h3>
                <span>{comments.length}</span>
              </div>

              {commentError && (
                <p className="tasks-error-message">{commentError}</p>
              )}

              <div className="task-comments-list">
                {loadingComments ? (
                  <p className="task-no-comments">
                    {isFr
                      ? "Chargement des commentaires..."
                      : "Loading comments..."}
                  </p>
                ) : comments.length === 0 ? (
                  <p className="task-no-comments">
                    {isFr
                      ? "Aucun commentaire pour le moment. Soyez la première à commenter."
                      : "No comments yet. Be the first to comment."}
                  </p>
                ) : (
                  comments.map((comment) => (
                    <article className="task-comment" key={comment.id}>
                      <div className="task-comment-avatar">
                        {comment.initials}
                      </div>

                      <div className="task-comment-body">
                        <div className="task-comment-author">
                          <strong>{comment.author}</strong>
                          <span>{comment.date}</span>
                        </div>

                        <p>{comment.text}</p>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <form
                className="task-comment-form"
                onSubmit={addComment}
              >
                <div className="task-comment-avatar"> </div>

                <div className="task-comment-input-wrap">
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder={
                      isFr
                        ? "Écrire un commentaire..."
                        : "Write a comment..."
                    }
                    rows={3}
                    maxLength={2000}
                  />

                  <div className="task-comment-form-footer">
                    <span>{commentText.length}/2000</span>

                    <button
                      type="submit"
                      disabled={!commentText.trim() || sendingComment}
                      className="task-comment-submit"
                    >
                      <Send size={15} />
                      {sendingComment
                        ? isFr
                          ? "Envoi..."
                          : "Sending..."
                        : isFr
                          ? "Envoyer"
                          : "Send"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
