import { useOutletContext, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api";
import {
  ArrowUpRight,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  Clock3,
  Users,
  Plus,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";
import "./Dashboard.css";

const translations = {
  fr: {
    welcome: "Bonjour, Fatima 👋",
    subtitle: "Voici un aperçu de l'activité de votre espace de travail.",
    newProject: "Nouveau projet",
    activeProjects: "Projets actifs",
    completedTasks: "Tâches terminées",
    inProgress: "Tâches en cours",
    teamMembers: "Membres de l'équipe",
    overview: "Aperçu des projets",
    viewAll: "Voir tous",
    recentTasks: "Tâches récentes",
    dueDate: "Échéance",
    project: "Projet",
    task: "Tâche",
    status: "Statut",
    priority: "Priorité",
    progress: "Progression",
    ongoing: "En cours",
    completed: "Terminé",
    todo: "À faire",
    upcoming: "À venir",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
    urgent: "Urgente",
    loading: "Chargement des données...",
    loadError: "Impossible de charger les données.",
    noProjects: "Aucun projet pour le moment.",
    noTasks: "Aucune tâche pour le moment.",
    noDescription: "Aucune description",
    projectOverviewSubtitle: "Suivez l'avancement de vos projets",
    recentTasksSubtitle: "Les dernières tâches de votre espace",
    noDeadline: "Non définie",
  },
  en: {
    welcome: "Hello, Fatima 👋",
    subtitle: "Here is an overview of your workspace activity.",
    newProject: "New project",
    activeProjects: "Active projects",
    completedTasks: "Completed tasks",
    inProgress: "Tasks in progress",
    teamMembers: "Team members",
    overview: "Project overview",
    viewAll: "View all",
    recentTasks: "Recent tasks",
    dueDate: "Due date",
    project: "Project",
    task: "Task",
    status: "Status",
    priority: "Priority",
    progress: "Progress",
    ongoing: "In progress",
    completed: "Completed",
    todo: "To do",
    upcoming: "Upcoming",
    high: "High",
    medium: "Medium",
    low: "Low",
    urgent: "Urgent",
    loading: "Loading data...",
    loadError: "Unable to load data.",
    noProjects: "No projects yet.",
    noTasks: "No tasks yet.",
    noDescription: "No description",
    projectOverviewSubtitle: "Track the progress of your projects",
    recentTasksSubtitle: "The latest tasks in your workspace",
    noDeadline: "Not set",
  },
};

const projectColors = ["#2563eb", "#8b5cf6", "#0d9488"];

const statusClass = {
  "En cours": "ongoing",
  "Terminé": "completed",
  "À faire": "todo",
  "À venir": "todo",
};

const priorityClass = {
  Urgente: "high",
  Haute: "high",
  Moyenne: "medium",
  Basse: "low",
};

function getInitials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Dashboard() {
  const { language = "fr" } = useOutletContext() || {};
  const navigate = useNavigate();
  const t = translations[language] || translations.fr;
  const user = JSON.parse(localStorage.getItem("user") || "null");

const userRole =
  typeof user?.role === "object"
    ? user.role?.name
    : user?.role;

const canCreateProject =
  userRole === "Admin" || userRole === "Chef de projet";

  const [dashboardData, setDashboardData] = useState(null);
  const [projectsData, setProjectsData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [stats, projects, tasks] = await Promise.all([
          apiRequest("/dashboard"),
          apiRequest("/projects"),
          apiRequest("/tasks"),
        ]);

        if (cancelled) return;

        setDashboardData(stats);
        setProjectsData(Array.isArray(projects) ? projects : []);
        setTasksData(Array.isArray(tasks) ? tasks : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || t.loadError);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [t.loadError]);

  const activeProjects = projectsData.filter(
    (project) => project.status === "En cours"
  ).length;
  const completedTasks = dashboardData?.tasks?.terminees ?? 0;
  const inProgressTasks = dashboardData?.tasks?.en_cours ?? 0;

  const teamMembers = useMemo(() => {
    const ids = new Set();
    projectsData.forEach((project) => {
      (project.members || []).forEach((member) => {
        if (member?.id != null) ids.add(member.id);
      });
    });
    return ids.size;
  }, [projectsData]);

  const recentProjects = projectsData.slice(0, 3).map((project, index) => {
    const projectTasks = tasksData.filter(
      (task) => task.project_id === project.id || task.project?.id === project.id
    );
    const completedForProject = projectTasks.filter(
      (task) => task.status === "Terminé"
    ).length;
    const progress = projectTasks.length
      ? Math.round((completedForProject / projectTasks.length) * 100)
      : project.status === "Terminé"
        ? 100
        : 0;

    return {
      ...project,
      color: projectColors[index % projectColors.length],
      progress,
      members: project.members || [],
      displayStatus: statusClass[project.status] ? project.status : "À venir",
    };
  });

  const recentTasks = tasksData.slice(0, 3).map((task) => ({
    id: task.id,
    name: task.title || "—",
    project: task.project?.name || "—",
    date: task.deadline
      ? new Date(`${String(task.deadline).slice(0, 10)}T00:00:00`).toLocaleDateString(
          language === "fr" ? "fr-FR" : "en-GB",
          { day: "2-digit", month: "short", year: "numeric" }
        )
      : t.noDeadline,
    priority: priorityClass[task.priority] ? task.priority : "Moyenne",
    status: statusClass[task.status] ? task.status : "À faire",
  }));

  const statCards = [
    {
      key: "activeProjects",
      value: String(activeProjects).padStart(2, "0"),
      icon: FolderKanban,
      tone: "blue",
    },
    {
      key: "completedTasks",
      value: String(completedTasks).padStart(2, "0"),
      icon: CheckCircle2,
      tone: "green",
    },
    {
      key: "inProgress",
      value: String(inProgressTasks).padStart(2, "0"),
      icon: Clock3,
      tone: "orange",
    },
    {
      key: "teamMembers",
      value: String(teamMembers).padStart(2, "0"),
      icon: Users,
      tone: "purple",
    },
  ];

  return (
    <div className="tf-dashboard">
      <section className="tf-dashboard-heading">
        <div>
          <div className="tf-eyebrow">
            <span className="tf-live-dot" />
            TEAM WORKSPACE
          </div>
          <h1>{t.welcome}</h1>
          <p>{t.subtitle}</p>
        </div>

        {canCreateProject && (
          <Button
            className="tf-primary-button"
            type="button"
            onClick={() => navigate("/projects")}
          >
            <Plus size={18} />
            {t.newProject}
          </Button>
        )}
      </section>

      {loading && <p role="status">{t.loading}</p>}
      {error && (
        <p role="alert" className="tf-dashboard-error">
          {t.loadError} {error}
        </p>
      )}

      <section className="tf-stats-grid">
        {statCards.map(({ key, value, icon: Icon, tone }) => (
          <article className="tf-stat-card" key={key}>
            <div className="tf-stat-top">
              <div className={`tf-stat-icon ${tone}`}>
                <Icon size={21} />
              </div>
              <button
                className="tf-more-button"
                aria-label={language === "fr" ? "Plus d'options" : "More options"}
                type="button"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="tf-stat-value">{value}</div>
            <div className="tf-stat-label">{t[key]}</div>
            <div className={`tf-stat-change ${tone}`}>
              <ArrowUpRight size={14} />
              <span>{key === "activeProjects" ? "+" : ""}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="tf-dashboard-section">
        <div className="tf-section-heading">
          <div>
            <h2>{t.overview}</h2>
            <p>{t.projectOverviewSubtitle}</p>
          </div>
          <a href="/projects" className="tf-text-link">
            {t.viewAll}
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="tf-project-grid">
          {!loading && recentProjects.length === 0 && <p>{t.noProjects}</p>}
          {recentProjects.map((project) => (
            <article className="tf-project-card" key={project.id}>
              <div className="tf-project-card-top">
                <div
                  className="tf-project-icon"
                  style={{
                    background: `${project.color}15`,
                    color: project.color,
                  }}
                >
                  <FolderKanban size={21} />
                </div>
                <button
                  className="tf-more-button"
                  aria-label={language === "fr" ? "Options du projet" : "Project options"}
                  type="button"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <h3>{project.name}</h3>
              <p className="tf-project-description">
                {project.description || t.noDescription}
              </p>

              <div className="tf-project-progress-label">
                <span>{t.progress}</span>
                <strong>{project.progress}%</strong>
              </div>
              <div className="tf-progress-track">
                <div
                  className="tf-progress-fill"
                  style={{
                    width: `${project.progress}%`,
                    background: project.color,
                  }}
                />
              </div>

              <div className="tf-project-footer">
                <div className="tf-avatar-stack">
                  {project.members.slice(0, 3).map((member, index) => (
                    <span
                      className={`tf-mini-avatar tf-mini-avatar-${index}`}
                      key={member.id}
                      title={member.name || "Membre"}
                    >
                      {getInitials(member.name)}
                    </span>
                  ))}
                </div>
                <span
                  className={`tf-status-badge ${statusClass[project.displayStatus] || "todo"}`}
                >
                  {project.displayStatus === "À venir"
                    ? t.upcoming
                    : project.displayStatus === "En cours"
                      ? t.ongoing
                      : t.completed}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tf-dashboard-section tf-tasks-section">
        <div className="tf-section-heading">
          <div>
            <h2>{t.recentTasks}</h2>
            <p>{t.recentTasksSubtitle}</p>
          </div>
          <a href="/tasks" className="tf-text-link">
            {t.viewAll}
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="tf-table-wrapper">
          <table className="tf-tasks-table">
            <thead>
              <tr>
                <th>{t.task}</th>
                <th>{t.project}</th>
                <th>{t.dueDate}</th>
                <th>{t.priority}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {!loading && recentTasks.length === 0 && (
                <tr>
                  <td colSpan={5}>{t.noTasks}</td>
                </tr>
              )}
              {recentTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div className="tf-task-name">
                      <span
                        className={`tf-task-check ${task.status === "Terminé" ? "checked" : ""}`}
                      >
                        {task.status === "Terminé" && <CheckCircle2 size={17} />}
                      </span>
                      <span>{task.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="tf-table-project">{task.project}</span>
                  </td>
                  <td>
                    <span className="tf-date-cell">
                      <CalendarDays size={14} />
                      {task.date}
                    </span>
                  </td>
                  <td>
                    <span className={`tf-priority-badge ${priorityClass[task.priority] || "medium"}`}>
                      {task.priority === "Urgente"
                        ? t.urgent
                        : task.priority === "Haute"
                          ? t.high
                          : task.priority === "Moyenne"
                            ? t.medium
                            : t.low}
                    </span>
                  </td>
                  <td>
                    <span className={`tf-status-badge ${statusClass[task.status] || "todo"}`}>
                      {task.status === "En cours"
                        ? t.ongoing
                        : task.status === "Terminé"
                          ? t.completed
                          : t.todo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
