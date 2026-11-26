import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api";
import {
  ArrowRight, ArrowUpRight, FolderKanban, CheckCircle2,
  Clock3, Users, Plus, CalendarDays, TrendingUp,
  CircleDot, ListTodo, Sparkles, Activity, Target,
  MoreHorizontal, BriefcaseBusiness, Check, Zap,
} from "lucide-react";
import "./Dashboard.css";

const translations = {
  fr: {
    welcome: "Bonjour", subtitle: "Voici ce qui se passe dans votre espace de travail.",
    newProject: "Nouveau projet", activeProjects: "Projets actifs",
    completedTasks: "Tâches terminées", inProgress: "Tâches en cours",
    teamMembers: "Membres de l'équipe", overview: "Vos projets",
    viewAll: "Voir tout", recentTasks: "Tâches récentes",
    dueDate: "Échéance", project: "Projet", task: "Tâche",
    status: "Statut", priority: "Priorité", progress: "Progression",
    ongoing: "En cours", completed: "Terminé", todo: "À faire",
    upcoming: "À venir", high: "Haute", medium: "Moyenne",
    low: "Basse", urgent: "Urgente", loading: "Chargement des données...",
    loadError: "Impossible de charger les données.",
    noProjects: "Aucun projet pour le moment.",
    noTasks: "Aucune tâche pour le moment.",
    noDescription: "Aucune description",
    projectSubtitle: "Suivez l'avancement de vos projets et de vos équipes.",
    tasksSubtitle: "Gardez un œil sur les dernières activités.",
    noDeadline: "Non définie", workspaceStatus: "Vue d'ensemble",
    workspaceHealthy: "Votre espace est opérationnel",
    workspaceDescription: "Un aperçu global de votre activité et de vos objectifs.",
    totalProjects: "Total projets", totalTasks: "Total tâches",
    quickActions: "Accès rapide", manageProjects: "Gérer les projets",
    manageTasks: "Gérer les tâches", manageTeam: "Voir l'équipe",
    analytics: "Analyses & performances",
    analyticsSubtitle: "Comprenez l'avancement de votre travail.",
    taskDistribution: "Répartition des tâches",
    projectProgress: "Progression des projets",
    tasksCompleted: "Terminées", tasksInProgress: "En cours",
    tasksTodo: "À faire", total: "Total", noAnalytics: "Aucune donnée disponible",
    classifiedTasks: "Tâches suivies", completionRate: "Taux de réalisation",
    workspace: "ESPACE DE TRAVAIL", performance: "VUE ANALYTIQUE",
    taskManagement: "SUIVI DES ACTIVITÉS", live: "EN DIRECT",
    overallProgress: "Progression globale", activeNow: "Espace actif",
    today: "Aujourd'hui", projectCount: "projets", taskCount: "tâches",
    latestProjects: "Derniers projets", projectMembers: "membres",
    noMembers: "Aucun membre", allActivity: "Toute votre activité",
    workspaceNote: "Continuez à faire avancer vos projets.",
  },
  en: {
    welcome: "Hello", subtitle: "Here's what's happening in your workspace.",
    newProject: "New project", activeProjects: "Active projects",
    completedTasks: "Completed tasks", inProgress: "Tasks in progress",
    teamMembers: "Team members", overview: "Your projects",
    viewAll: "View all", recentTasks: "Recent tasks",
    dueDate: "Due date", project: "Project", task: "Task",
    status: "Status", priority: "Priority", progress: "Progress",
    ongoing: "In progress", completed: "Completed", todo: "To do",
    upcoming: "Upcoming", high: "High", medium: "Medium",
    low: "Low", urgent: "Urgent", loading: "Loading data...",
    loadError: "Unable to load data.", noProjects: "No projects yet.",
    noTasks: "No tasks yet.", noDescription: "No description",
    projectSubtitle: "Track the progress of your projects and teams.",
    tasksSubtitle: "Keep an eye on the latest activities.",
    noDeadline: "Not set", workspaceStatus: "Workspace overview",
    workspaceHealthy: "Your workspace is up and running",
    workspaceDescription: "A complete overview of your activity and goals.",
    totalProjects: "Total projects", totalTasks: "Total tasks",
    quickActions: "Quick access", manageProjects: "Manage projects",
    manageTasks: "Manage tasks", manageTeam: "View team",
    analytics: "Analytics & performance",
    analyticsSubtitle: "Understand how your work is progressing.",
    taskDistribution: "Task distribution",
    projectProgress: "Project progress",
    tasksCompleted: "Completed", tasksInProgress: "In progress",
    tasksTodo: "To do", total: "Total", noAnalytics: "No data available",
    classifiedTasks: "Tracked tasks", completionRate: "Completion rate",
    workspace: "WORKSPACE", performance: "PERFORMANCE",
    taskManagement: "ACTIVITY TRACKING", live: "LIVE",
    overallProgress: "Overall progress", activeNow: "Workspace active",
    today: "Today", projectCount: "projects", taskCount: "tasks",
    latestProjects: "Latest projects", projectMembers: "members",
    noMembers: "No members", allActivity: "All your activity",
    workspaceNote: "Keep moving your projects forward.",
  },
};

const projectColors = ["#8064d8", "#18a58b", "#e6a04b", "#5685d8", "#d8759e"];

const statusClass = {
  "En cours": "ongoing",
  Terminé: "completed",
  "À faire": "todo",
  "À venir": "todo",
};

const priorityClass = {
  Urgente: "high",
  Haute: "high",
  Moyenne: "medium",
  Basse: "low",
};

function getStoredUser() {
  try {
    const stored = localStorage.getItem("user") || localStorage.getItem("currentUser");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.user || parsed?.data?.user || parsed;
  } catch {
    return null;
  }
}

function getUserName(user) {
  const name =
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    user?.username ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  return typeof name === "string" ? name.trim() : "";
}

function getInitials(name) {
  if (!name) return "U";
  return name.trim().split(/\s+/).slice(0, 2)
    .map((part) => part[0]).join("").toUpperCase();
}

function formatDate(date, language, fallback) {
  if (!date) return fallback;
  const parsed = new Date(`${String(date).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return fallback;

  return parsed.toLocaleDateString(
    language === "fr" ? "fr-FR" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" }
  );
}

function isTaskInProject(task, projectId) {
  return (
    String(task.project_id) === String(projectId) ||
    String(task.project?.id) === String(projectId)
  );
}

function calculatePercentages(items, total) {
  if (!total) return items.map(() => 0);

  const values = items.map((item) => {
    const exact = (item.value / total) * 100;
    return { floor: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });

  const result = values.map((item) => item.floor);
  let remaining = 100 - result.reduce((sum, value) => sum + value, 0);

  const order = values
    .map((item, index) => ({ index, remainder: item.remainder }))
    .sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < remaining; i++) {
    result[order[i].index] += 1;
  }

  return result;
}

export default function Dashboard() {
  const { language = "fr" } = useOutletContext() || {};
  const navigate = useNavigate();
  const t = translations[language] || translations.fr;

  const user = getStoredUser();
  const userName = getUserName(user);
  const firstName = userName ? userName.split(/\s+/)[0] : "";
  const welcomeMessage = firstName
    ? `${t.welcome}, ${firstName} 👋`
    : `${t.welcome} 👋`;

  const userRole = typeof user?.role === "object"
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
        if (!cancelled) setError(err.message || t.loadError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => { cancelled = true; };
  }, [t.loadError]);

  // Statistics
  const activeProjects = projectsData.filter(
    (project) => project.status === "En cours"
  ).length;

  const completedTasks =
    dashboardData?.tasks?.terminees ??
    tasksData.filter((task) => task.status === "Terminé").length;

  const inProgressTasks =
    dashboardData?.tasks?.en_cours ??
    tasksData.filter((task) => task.status === "En cours").length;

  const teamMembers = useMemo(() => {
    const ids = new Set();
    projectsData.forEach((project) => {
      (project.members || []).forEach((member) => {
        if (member?.id != null) ids.add(member.id);
      });
    });
    return ids.size;
  }, [projectsData]);

  const totalTasks = tasksData.length;
  const totalProjects = projectsData.length;

  const completionRate = totalTasks
    ? Math.round(
        (tasksData.filter((task) => task.status === "Terminé").length / totalTasks) * 100
      )
    : 0;

  // Projects
  const recentProjects = projectsData.slice(0, 4).map((project, index) => {
    const projectTasks = tasksData.filter((task) =>
      isTaskInProject(task, project.id)
    );

    const completed = projectTasks.filter(
      (task) => task.status === "Terminé"
    ).length;

    const progress = projectTasks.length
      ? Math.round((completed / projectTasks.length) * 100)
      : project.status === "Terminé" ? 100 : 0;

    return {
      ...project,
      color: projectColors[index % projectColors.length],
      progress,
      members: project.members || [],
      displayStatus: statusClass[project.status] ? project.status : "À venir",
    };
  });

  // Recent tasks
  const recentTasks = tasksData.slice(0, 5).map((task) => ({
    id: task.id,
    name: task.title || "—",
    project: task.project?.name || "—",
    date: formatDate(task.deadline, language, t.noDeadline),
    priority: priorityClass[task.priority] ? task.priority : "Moyenne",
    status: statusClass[task.status] ? task.status : "À faire",
  }));

  // Analytics
  const taskStats = {
    completed: tasksData.filter((task) => task.status === "Terminé").length,
    inProgress: tasksData.filter((task) => task.status === "En cours").length,
    todo: tasksData.filter(
      (task) => task.status === "À faire" || task.status === "À venir"
    ).length,
  };

  const classifiedTasks =
    taskStats.completed + taskStats.inProgress + taskStats.todo;

  const taskDistributionBase = [
    { key: "completed", label: t.tasksCompleted, value: taskStats.completed, color: "#18a58b" },
    { key: "inProgress", label: t.tasksInProgress, value: taskStats.inProgress, color: "#8064d8" },
    { key: "todo", label: t.tasksTodo, value: taskStats.todo, color: "#e6a04b" },
  ];

  const taskPercentages = calculatePercentages(taskDistributionBase, classifiedTasks);
  const taskDistribution = taskDistributionBase.map((item, index) => ({
    ...item,
    percentage: taskPercentages[index],
  }));

  let currentAngle = 0;
  const donutGradient = classifiedTasks
    ? `conic-gradient(${taskDistribution
        .filter((item) => item.value > 0)
        .map((item) => {
          const start = currentAngle;
          const end = start + (item.value / classifiedTasks) * 360;
          currentAngle = end;
          return `${item.color} ${start}deg ${end}deg`;
        }).join(", ")})`
    : "#eeeaf5";

  const analyticsProjects = projectsData.slice(0, 5).map((project, index) => {
    const projectTasks = tasksData.filter((task) =>
      isTaskInProject(task, project.id)
    );
    const completed = projectTasks.filter(
      (task) => task.status === "Terminé"
    ).length;

    return {
      id: project.id,
      name: project.name,
      progress: projectTasks.length
        ? Math.round((completed / projectTasks.length) * 100)
        : project.status === "Terminé" ? 100 : 0,
      totalTasks: projectTasks.length,
      color: projectColors[index % projectColors.length],
    };
  });

  const statCards = [
    {
      key: "activeProjects", value: activeProjects,
      icon: FolderKanban, tone: "violet",
      description: language === "fr" ? "Projets en activité" : "Projects underway",
    },
    {
      key: "completedTasks", value: completedTasks,
      icon: CheckCircle2, tone: "green",
      description: language === "fr" ? "Travail accompli" : "Work completed",
    },
    {
      key: "inProgress", value: inProgressTasks,
      icon: Clock3, tone: "amber",
      description: language === "fr" ? "À traiter actuellement" : "Currently underway",
    },
    {
      key: "teamMembers", value: teamMembers,
      icon: Users, tone: "blue",
      description: language === "fr" ? "Collaborateurs impliqués" : "People collaborating",
    },
  ];

  const today = new Date().toLocaleDateString(
    language === "fr" ? "fr-FR" : "en-GB",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <main className="tf-dashboard">
      {/* PAGE HEADER */}
      <header className="tf-dashboard-top">
        <div className="tf-page-intro">
          <div className="tf-page-eyebrow">
            <span className="tf-eyebrow-indicator" />
            TEAMFLOW <span>/</span> DASHBOARD
          </div>
          <h1>{welcomeMessage}</h1>
          <p>{t.subtitle}</p>
          <div className="tf-page-date">
            <CalendarDays size={15} />
            <span>{today}</span>
          </div>
        </div>

        <div className="tf-header-actions">
          <div className="tf-user-chip">
            <span className="tf-user-avatar">{getInitials(userName)}</span>
            <span className="tf-user-chip-text">
              <strong>{userName || "User"}</strong>
              <small>{userRole || "Team member"}</small>
            </span>
          </div>

          {canCreateProject && (
            <button
              className="tf-create-button"
              type="button"
              onClick={() => navigate("/projects")}
            >
              <Plus size={17} />
              {t.newProject}
              <ArrowUpRight size={15} />
            </button>
          )}
        </div>
      </header>

      {loading && (
        <div className="tf-loading-card">
          <span className="tf-loading-spinner" />
          {t.loading}
        </div>
      )}

      {error && (
        <div role="alert" className="tf-dashboard-error">
          <strong>{t.loadError}</strong>
          <span>{error}</span>
        </div>
      )}

      {/* KPI CARDS */}
      <section className="tf-stats-grid">
        {statCards.map(({ key, value, icon: Icon, tone, description }) => (
          <article className={`tf-stat-card ${tone}`} key={key}>
            <div className="tf-stat-top">
              <span className={`tf-stat-icon ${tone}`}><Icon size={19} /></span>
              <span className="tf-stat-symbol"><Activity size={15} /></span>
            </div>
            <div className="tf-stat-number">{String(value).padStart(2, "0")}</div>
            <div className="tf-stat-label">{t[key]}</div>
            <div className="tf-stat-description">{description}</div>
          </article>
        ))}
      </section>

      {/* PROJECTS AND WORKSPACE SUMMARY */}
      <section className="tf-overview-grid">
        <article className="tf-panel tf-projects-panel">
          <div className="tf-panel-heading">
            <div>
              <span className="tf-panel-eyebrow"><BriefcaseBusiness size={14} /> {t.workspace}</span>
              <h2>{t.overview}</h2>
              <p>{t.projectSubtitle}</p>
            </div>
            <button className="tf-view-link" onClick={() => navigate("/projects")} type="button">
              {t.viewAll}<ArrowRight size={15} />
            </button>
          </div>

          <div className="tf-project-list">
            {!loading && recentProjects.length === 0 && (
              <div className="tf-empty-state">
                <FolderKanban size={25} />
                <span>{t.noProjects}</span>
              </div>
            )}

            {recentProjects.map((project) => (
              <button
                type="button"
                className="tf-project-row"
                key={project.id}
                onClick={() => navigate("/projects")}
              >
                <span
                  className="tf-project-mark"
                  style={{ color: project.color, background: `${project.color}15` }}
                >
                  <FolderKanban size={19} />
                </span>

                <span className="tf-project-main">
                  <strong>{project.name}</strong>
                  <small>{project.description || t.noDescription}</small>
                </span>

                <span className="tf-project-team">
                  <span className="tf-avatar-stack">
                    {project.members.slice(0, 3).map((member, index) => (
                      <span
                        className={`tf-mini-avatar avatar-${index}`}
                        key={member.id}
                        title={member.name || "Member"}
                      >
                        {getInitials(member.name)}
                      </span>
                    ))}
                    {project.members.length > 3 && (
                      <span className="tf-more-members">+{project.members.length - 3}</span>
                    )}
                  </span>
                  <small>{project.members.length} {t.projectMembers}</small>
                </span>

                <span className="tf-project-progress">
                  <span className="tf-project-progress-top">
                    <strong>{project.progress}%</strong>
                    <small>{t.progress}</small>
                  </span>
                  <span className="tf-progress-track">
                    <span
                      className="tf-progress-fill"
                      style={{ width: `${project.progress}%`, background: project.color }}
                    />
                  </span>
                </span>

                <span className={`tf-status-badge ${statusClass[project.displayStatus] || "todo"}`}>
                  {project.displayStatus === "À venir"
                    ? t.upcoming
                    : project.displayStatus === "En cours"
                      ? t.ongoing
                      : t.completed}
                </span>
                <ArrowUpRight className="tf-project-arrow" size={16} />
              </button>
            ))}
          </div>
          <div className="tf-projects-footer">
            <span><span className="tf-footer-dot" /> {t.latestProjects}</span>
            <strong>{totalProjects} {t.projectCount}</strong>
          </div>
        </article>

        <aside className="tf-workspace-card">
          <div className="tf-workspace-topline">
            <span className="tf-workspace-icon"><Sparkles size={18} /></span>
            <span className="tf-workspace-live"><i /> {t.live}</span>
          </div>

          <span className="tf-workspace-eyebrow">{t.workspace}</span>
          <h2>{t.workspaceStatus}</h2>
          <p>{t.workspaceHealthy}</p>
          <span className="tf-workspace-note">{t.workspaceDescription}</span>

          <div className="tf-workspace-score">
            <div className="tf-score-heading">
              <span>{t.overallProgress}</span>
              <strong>{completionRate}%</strong>
            </div>
            <div className="tf-score-track">
              <span style={{ width: `${completionRate}%` }} />
            </div>
            <small>{t.workspaceNote}</small>
          </div>

          <div className="tf-workspace-metrics">
            <div>
              <strong>{String(totalProjects).padStart(2, "0")}</strong>
              <span>{t.totalProjects}</span>
            </div>
            <div>
              <strong>{String(totalTasks).padStart(2, "0")}</strong>
              <span>{t.totalTasks}</span>
            </div>
            <div>
              <strong>{String(completedTasks).padStart(2, "0")}</strong>
              <span>{t.completedTasks}</span>
            </div>
          </div>
        </aside>
      </section>

      {/* ANALYTICS */}
      <section className="tf-analytics-section">
        <div className="tf-section-title">
          <div>
            <span className="tf-panel-eyebrow"><TrendingUp size={14} /> {t.performance}</span>
            <h2>{t.analytics}</h2>
            <p>{t.analyticsSubtitle}</p>
          </div>
        </div>

        <div className="tf-analytics-grid">
          <article className="tf-panel tf-analytics-card">
            <div className="tf-panel-heading compact">
              <div>
                <h3>{t.taskDistribution}</h3>
                <p>{t.total}: {classifiedTasks}</p>
              </div>
              <span className="tf-analytics-icon"><ListTodo size={19} /></span>
            </div>

            {classifiedTasks > 0 ? (
              <>
                <div className="tf-donut-content">
                  <div className="tf-donut-visual" style={{ background: donutGradient }}>
                    <div className="tf-donut-center">
                      <strong>{classifiedTasks}</strong>
                      <span>{t.classifiedTasks}</span>
                    </div>
                  </div>

                  <div className="tf-donut-legend">
                    {taskDistribution.map((item) => (
                      <div className="tf-legend-item" key={item.key}>
                        <span className="tf-legend-label">
                          <i style={{ background: item.color }} />
                          {item.label}
                        </span>
                        <span className="tf-legend-value">
                          <strong>{item.value}</strong>
                          <small>{item.percentage}%</small>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tf-analytics-footer">
                  <span>{t.completionRate}</span>
                  <strong>{taskDistribution.find((item) => item.key === "completed")?.percentage || 0}%</strong>
                </div>
              </>
            ) : (
              <div className="tf-analytics-empty">{t.noAnalytics}</div>
            )}
          </article>

          <article className="tf-panel tf-analytics-card">
            <div className="tf-panel-heading compact">
              <div>
                <h3>{t.projectProgress}</h3>
                <p>{totalProjects} {t.projectCount}</p>
              </div>
              <span className="tf-analytics-icon"><Target size={19} /></span>
            </div>

            {analyticsProjects.length ? (
              <div className="tf-analytics-project-list">
                {analyticsProjects.map((project) => (
                  <div className="tf-analytics-project" key={project.id}>
                    <div className="tf-analytics-project-heading">
                      <span><i style={{ background: project.color }} />{project.name}</span>
                      <strong>{project.progress}%</strong>
                    </div>
                    <div className="tf-analytics-track">
                      <span style={{ width: `${project.progress}%`, background: project.color }} />
                    </div>
                    <small>{project.totalTasks} {t.taskCount}</small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tf-analytics-empty">{t.noAnalytics}</div>
            )}
          </article>
        </div>
      </section>

      {/* RECENT TASKS */}
      <section className="tf-panel tf-tasks-section">
        <div className="tf-panel-heading">
          <div>
            <span className="tf-panel-eyebrow"><Zap size={14} /> {t.taskManagement}</span>
            <h2>{t.recentTasks}</h2>
            <p>{t.tasksSubtitle}</p>
          </div>
          <button className="tf-view-link" onClick={() => navigate("/tasks")} type="button">
            {t.viewAll}<ArrowRight size={15} />
          </button>
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
                <tr><td colSpan={5} className="tf-table-empty"><ListTodo size={21} />{t.noTasks}</td></tr>
              )}

              {recentTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <span className="tf-task-name">
                      <span className={`tf-task-check ${task.status === "Terminé" ? "checked" : ""}`}>
                        {task.status === "Terminé" && <Check size={13} />}
                      </span>
                      <strong>{task.name}</strong>
                    </span>
                  </td>
                  <td><span className="tf-table-project">{task.project}</span></td>
                  <td><span className="tf-date-cell"><CalendarDays size={13} />{task.date}</span></td>
                  <td>
                    <span className={`tf-priority-badge ${priorityClass[task.priority] || "medium"}`}>
                      <CircleDot size={10} />
                      {task.priority === "Urgente" ? t.urgent
                        : task.priority === "Haute" ? t.high
                          : task.priority === "Moyenne" ? t.medium : t.low}
                    </span>
                  </td>
                  <td>
                    <span className={`tf-status-badge ${statusClass[task.status] || "todo"}`}>
                      {task.status === "En cours" ? t.ongoing
                        : task.status === "Terminé" ? t.completed
                          : task.status === "À venir" ? t.upcoming : t.todo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="tf-quick-access">
        <div className="tf-quick-access-heading">
          <span className="tf-panel-eyebrow"><Sparkles size={14} /> TEAMFLOW</span>
          <h2>{t.quickActions}</h2>
        </div>

        <button type="button" onClick={() => navigate("/projects")}>
          <span className="tf-quick-icon violet"><FolderKanban size={18} /></span>
          <span><strong>{t.manageProjects}</strong><small>{t.totalProjects}: {totalProjects}</small></span>
          <ArrowUpRight size={17} />
        </button>

        <button type="button" onClick={() => navigate("/tasks")}>
          <span className="tf-quick-icon green"><ListTodo size={18} /></span>
          <span><strong>{t.manageTasks}</strong><small>{t.totalTasks}: {totalTasks}</small></span>
          <ArrowUpRight size={17} />
        </button>

        <button type="button" onClick={() => navigate("/team")}>
          <span className="tf-quick-icon blue"><Users size={18} /></span>
          <span><strong>{t.manageTeam}</strong><small>{t.teamMembers}: {teamMembers}</small></span>
          <ArrowUpRight size={17} />
        </button>
      </section>
    </main>
  );
}