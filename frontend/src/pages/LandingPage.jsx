
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FolderKanban,
  Users,
  ChartNoAxesCombined,
  Menu,
  X,
  ShieldCheck,
  Bell,
  CalendarDays,
  CircleCheck,
  LayoutDashboard,
  Target,
  Zap,
  BarChart3,
  Sparkles,
  CircleHelp,
  LockKeyhole,
  ListTodo,
  Clock3,
  Flag,
  UserRound,
  Layers3,
} from "lucide-react";
import "./LandingPage.css";

export default function LandingPage() {
  const [language, setLanguage] = useState("FR");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeProduct, setActiveProduct] = useState("projects");

  const isFr = language === "FR";

  const content = {
    FR: {
      navFeatures: "Fonctionnalités",
      navHow: "Comment ça marche",
      navAbout: "À propos",
      navFaq: "FAQ",
      login: "Connexion",
      register: "Commencer gratuitement",

      badge: "L'espace de travail de votre équipe",
      heroTitle1: "Transformez vos projets",
      heroTitle2: "en réussites collectives.",
      heroDescription:
        "Organisez vos projets, coordonnez votre équipe et suivez chaque avancée depuis un espace de travail clair et centralisé.",
      start: "Commencer maintenant",
      discover: "Découvrir la plateforme",
      trust: "Projets, tâches et équipe réunis au même endroit.",

      preview: "APERÇU DE L'INTERFACE",
      workspace: "Espace de travail",
      overview: "Vue d'ensemble",
      projects: "Projets",
      tasks: "Tâches",
      team: "Équipe",
      analytics: "Analytique",
      today: "Aujourd'hui",
      welcome: "Bienvenue 👋",
      overviewDesc: "Voici un aperçu de votre espace de travail.",
      totalProjects: "Projets actifs",
      completedTasks: "Tâches terminées",
      teamMembers: "Membres",
      inProgress: "En cours",
      recentProjects: "Projets récents",
      viewAll: "Voir tout",
      projectOne: "Refonte du site web",
      projectTwo: "Application mobile",
      projectThree: "Gestion interne",
      taskDone: "Tâche terminée",
      taskDoneDesc: "Votre équipe avance bien !",
      sample: "Aperçu avec données de démonstration",
      active: "Actif",
      done: "Terminé",
      pending: "À faire",
      priority: "Priorité élevée",
      assigned: "Assignée à vous",
      work: "Travail en équipe",

      platformEyebrow: "UNE SEULE PLATEFORME",
      platformTitle: "Tout votre travail. Un espace clair.",
      platformDesc:
        "TeamFlow centralise les projets, les tâches, les membres et les indicateurs pour que votre équipe puisse avancer avec une vision commune.",

      featuresEyebrow: "TOUT AU MÊME ENDROIT",
      featuresTitle: "Les outils essentiels pour faire avancer vos projets.",
      featuresDesc:
        "Une expérience pensée pour organiser le travail quotidien sans multiplier les outils.",

      feature1: "Gestion des projets",
      feature1Desc:
        "Créez vos projets, définissez leurs informations essentielles et gardez une vision claire de leur avancement.",
      feature2: "Suivi des tâches",
      feature2Desc:
        "Attribuez les tâches, définissez les priorités et suivez leur progression jusqu'à leur réalisation.",
      feature3: "Collaboration d'équipe",
      feature3Desc:
        "Gérez les membres, distribuez les responsabilités et donnez à chacun une vision claire de son travail.",
      feature4: "Statistiques & analyses",
      feature4Desc:
        "Consultez les indicateurs disponibles pour comprendre l'état de vos projets et suivre leur progression.",
      feature5: "Notifications",
      feature5Desc:
        "Restez informé des changements et des activités importantes au sein de vos projets.",
      feature6: "Accès par rôle",
      feature6Desc:
        "Des permissions adaptées aux responsabilités de chaque utilisateur pour garder votre espace organisé.",

      howEyebrow: "SIMPLE ET EFFICACE",
      howTitle: "De l'idée au résultat, en quelques étapes.",
      howDesc:
        "Une organisation simple pour transformer le travail quotidien en progrès visible.",
      step1: "Créez votre projet",
      step1Desc:
        "Lancez un projet et renseignez les informations essentielles pour donner un cadre au travail.",
      step2: "Organisez le travail",
      step2Desc:
        "Ajoutez les membres, attribuez les tâches et définissez les priorités et échéances.",
      step3: "Suivez l'avancement",
      step3Desc:
        "Consultez les statuts, les tâches et les indicateurs pour garder le contrôle du projet.",

      productEyebrow: "EXPLOREZ LE PRODUIT",
      productTitle: "Une interface qui s'adapte à votre travail.",
      productDesc:
        "Passez d'une vue à l'autre pour retrouver rapidement ce dont votre équipe a besoin.",
      productProjects: "Projects",
      productTasks: "Tasks",
      productTeam: "Team",
      productAnalytics: "Analytics",
      productCta: "Créer mon espace",

      productProjectsTitle: "Gardez chaque projet sous contrôle.",
      productProjectsDesc:
        "Visualisez les projets, leur statut, leur progression et les membres associés.",
      productTasksTitle: "Sachez exactement quoi faire ensuite.",
      productTasksDesc:
        "Organisez les tâches par statut, priorité et responsable pour garder le travail structuré.",
      productTeamTitle: "Une équipe, des responsabilités claires.",
      productTeamDesc:
        "Gérez les membres et leurs rôles depuis un espace centralisé.",
      productAnalyticsTitle: "Une vision claire de votre progression.",
      productAnalyticsDesc:
        "Suivez les indicateurs disponibles pour mieux comprendre l'activité de vos projets.",

      aboutEyebrow: "POURQUOI TEAMFLOW ?",
      aboutTitle: "Moins de dispersion. Plus de visibilité.",
      aboutDesc:
        "TeamFlow rassemble les éléments essentiels de votre travail dans une expérience simple et structurée.",
      about1: "Toutes vos informations au même endroit",
      about2: "Une meilleure visibilité sur les responsabilités",
      about3: "Un suivi continu de l'avancement",
      about4: "Une organisation adaptée à chaque rôle",

      rolesEyebrow: "PENSÉ POUR VOTRE ÉQUIPE",
      rolesTitle: "Chaque rôle garde sa place.",
      rolesDesc:
        "Les responsabilités sont organisées selon le rôle de chaque utilisateur.",
      admin: "Administrateur",
      adminDesc:
        "Gérez les utilisateurs, les rôles et l'organisation globale de la plateforme.",
      manager: "Chef de projet",
      managerDesc:
        "Créez et pilotez vos projets, organisez le travail et gérez les membres associés.",
      member: "Membre",
      memberDesc:
        "Accédez aux projets auxquels vous participez et concentrez-vous sur vos tâches.",

      faqEyebrow: "VOUS AVEZ DES QUESTIONS ?",
      faqTitle: "Les réponses aux questions fréquentes.",
      faqDesc:
        "Quelques informations pour vous aider à découvrir TeamFlow.",
      faq1: "Qu'est-ce que TeamFlow ?",
      faq1Answer:
        "TeamFlow est une plateforme de gestion collaborative qui permet de gérer les projets, organiser les tâches, coordonner les membres et suivre les résultats depuis un espace centralisé.",
      faq2: "Qui peut utiliser TeamFlow ?",
      faq2Answer:
        "TeamFlow est conçu pour les équipes qui souhaitent mieux organiser leur travail. Les utilisateurs disposent de rôles adaptés à leurs responsabilités : administrateur, chef de projet ou membre.",
      faq3: "Puis-je suivre l'avancement de mes projets ?",
      faq3Answer:
        "Oui. Vous pouvez consulter les statuts des projets et des tâches, suivre les échéances et visualiser les indicateurs disponibles dans votre tableau de bord.",
      faq4: "Comment rejoindre un projet ?",
      faq4Answer:
        "Un administrateur ou un chef de projet peut ajouter des membres à un projet. Les membres peuvent ensuite consulter les projets auxquels ils sont associés.",
      faq5: "Mes informations sont-elles protégées ?",
      faq5Answer:
        "TeamFlow utilise une authentification et une gestion des rôles pour contrôler l'accès aux différentes fonctionnalités de la plateforme.",

      ctaEyebrow: "PRÊT À MIEUX TRAVAILLER ?",
      ctaTitle: "Votre équipe mérite un espace de travail plus clair.",
      ctaDesc:
        "Centralisez vos projets, organisez vos tâches et avancez ensemble avec TeamFlow.",
      ctaButton: "Créer mon compte",
      ctaLogin: "J'ai déjà un compte",

      footerDesc:
        "L'espace de travail collaboratif qui transforme l'organisation en résultats.",
      footerProduct: "Produit",
      footerCompany: "Plateforme",
      footerAccount: "Votre compte",
      footerFeatures: "Fonctionnalités",
      footerHow: "Comment ça marche",
      footerFaq: "Questions fréquentes",
      footerLogin: "Connexion",
      footerRegister: "Inscription",
      footerRights: "Tous droits réservés.",
    },

    EN: {
      navFeatures: "Features",
      navHow: "How it works",
      navAbout: "About",
      navFaq: "FAQ",
      login: "Log in",
      register: "Get started",

      badge: "Your team's workspace",
      heroTitle1: "Turn your projects",
      heroTitle2: "into shared success.",
      heroDescription:
        "Organize projects, coordinate your team and track every step from one clear and centralized workspace.",
      start: "Get started",
      discover: "Explore the platform",
      trust: "Projects, tasks and people brought together in one place.",

      preview: "INTERFACE PREVIEW",
      workspace: "Workspace",
      overview: "Overview",
      projects: "Projects",
      tasks: "Tasks",
      team: "Team",
      analytics: "Analytics",
      today: "Today",
      welcome: "Welcome 👋",
      overviewDesc: "Here's an overview of your workspace.",
      totalProjects: "Active projects",
      completedTasks: "Completed tasks",
      teamMembers: "Members",
      inProgress: "In progress",
      recentProjects: "Recent projects",
      viewAll: "View all",
      projectOne: "Website redesign",
      projectTwo: "Mobile application",
      projectThree: "Internal management",
      taskDone: "Task completed",
      taskDoneDesc: "Your team is making great progress!",
      sample: "Preview with sample data",
      active: "Active",
      done: "Done",
      pending: "To do",
      priority: "High priority",
      assigned: "Assigned to you",
      work: "Teamwork",

      platformEyebrow: "ONE PLATFORM",
      platformTitle: "All your work. One clear space.",
      platformDesc:
        "TeamFlow brings projects, tasks, members and insights together so your team can move forward with a shared view.",

      featuresEyebrow: "EVERYTHING IN ONE PLACE",
      featuresTitle: "The essential tools to move projects forward.",
      featuresDesc:
        "An experience designed to organize everyday work without multiplying tools.",

      feature1: "Project management",
      feature1Desc:
        "Create projects, define essential information and keep a clear view of their progress.",
      feature2: "Task tracking",
      feature2Desc:
        "Assign tasks, set priorities and track progress until completion.",
      feature3: "Team collaboration",
      feature3Desc:
        "Manage members, distribute responsibilities and give everyone a clear view of their work.",
      feature4: "Analytics & insights",
      feature4Desc:
        "Review available indicators to understand project status and track progress.",
      feature5: "Notifications",
      feature5Desc:
        "Stay informed about important changes and activities across your projects.",
      feature6: "Role-based access",
      feature6Desc:
        "Permissions adapted to each user's responsibilities to keep your workspace organized.",

      howEyebrow: "SIMPLE AND EFFECTIVE",
      howTitle: "From idea to result, in a few steps.",
      howDesc:
        "A simple workflow to turn everyday work into visible progress.",
      step1: "Create your project",
      step1Desc:
        "Start a project and add the essential information to give the work a clear framework.",
      step2: "Organize the work",
      step2Desc:
        "Add members, assign tasks and define priorities and deadlines.",
      step3: "Track progress",
      step3Desc:
        "Review statuses, tasks and available insights to stay in control.",

      productEyebrow: "EXPLORE THE PRODUCT",
      productTitle: "An interface that adapts to your work.",
      productDesc:
        "Switch between views to quickly find what your team needs.",
      productProjects: "Projects",
      productTasks: "Tasks",
      productTeam: "Team",
      productAnalytics: "Analytics",
      productCta: "Create my workspace",

      productProjectsTitle: "Keep every project under control.",
      productProjectsDesc:
        "See projects, their status, progress and associated members.",
      productTasksTitle: "Know exactly what to do next.",
      productTasksDesc:
        "Organize tasks by status, priority and owner to keep work structured.",
      productTeamTitle: "One team, clear responsibilities.",
      productTeamDesc:
        "Manage members and their roles from one centralized space.",
      productAnalyticsTitle: "A clear view of your progress.",
      productAnalyticsDesc:
        "Review available indicators to better understand project activity.",

      aboutEyebrow: "WHY TEAMFLOW?",
      aboutTitle: "Less scattered work. More visibility.",
      aboutDesc:
        "TeamFlow brings the essential parts of your work together in a simple and structured experience.",
      about1: "All your information in one place",
      about2: "Clear visibility into responsibilities",
      about3: "Continuous progress tracking",
      about4: "Organization adapted to each role",

      rolesEyebrow: "BUILT FOR YOUR TEAM",
      rolesTitle: "Every role has its place.",
      rolesDesc:
        "Responsibilities are organized around each user's role.",
      admin: "Administrator",
      adminDesc:
        "Manage users, roles and the overall organization of the platform.",
      manager: "Project manager",
      managerDesc:
        "Create and manage projects, organize work and manage associated members.",
      member: "Member",
      memberDesc:
        "Access assigned projects and focus on the tasks that matter.",

      faqEyebrow: "HAVE QUESTIONS?",
      faqTitle: "Frequently asked questions.",
      faqDesc:
        "A few things to know before getting started with TeamFlow.",
      faq1: "What is TeamFlow?",
      faq1Answer:
        "TeamFlow is a collaborative management platform that helps teams manage projects, organize tasks, coordinate members and track results from one central workspace.",
      faq2: "Who can use TeamFlow?",
      faq2Answer:
        "TeamFlow is designed for teams that want to organize their work better. Users have roles suited to their responsibilities: administrator, project manager or member.",
      faq3: "Can I track my project progress?",
      faq3Answer:
        "Yes. You can review project and task statuses, track deadlines and view available indicators in your dashboard.",
      faq4: "How can I join a project?",
      faq4Answer:
        "An administrator or project manager can add members to a project. Members can then access the projects they are assigned to.",
      faq5: "Is my information protected?",
      faq5Answer:
        "TeamFlow uses authentication and role-based access management to control access to the platform's features.",

      ctaEyebrow: "READY TO WORK BETTER?",
      ctaTitle: "Your team deserves a clearer workspace.",
      ctaDesc:
        "Centralize projects, organize tasks and move forward together with TeamFlow.",
      ctaButton: "Create my account",
      ctaLogin: "I already have an account",

      footerDesc:
        "The collaborative workspace that turns organization into results.",
      footerProduct: "Product",
      footerCompany: "Platform",
      footerAccount: "Your account",
      footerFeatures: "Features",
      footerHow: "How it works",
      footerFaq: "Frequently asked questions",
      footerLogin: "Log in",
      footerRegister: "Sign up",
      footerRights: "All rights reserved.",
    },
  };

  const t = content[language];

  const faqItems = [
    [t.faq1, t.faq1Answer],
    [t.faq2, t.faq2Answer],
    [t.faq3, t.faq3Answer],
    [t.faq4, t.faq4Answer],
    [t.faq5, t.faq5Answer],
  ];

  const productTabs = [
    {
      id: "projects",
      label: t.productProjects,
      icon: FolderKanban,
      title: t.productProjectsTitle,
      desc: t.productProjectsDesc,
    },
    {
      id: "tasks",
      label: t.productTasks,
      icon: ListTodo,
      title: t.productTasksTitle,
      desc: t.productTasksDesc,
    },
    {
      id: "team",
      label: t.productTeam,
      icon: Users,
      title: t.productTeamTitle,
      desc: t.productTeamDesc,
    },
    {
      id: "analytics",
      label: t.productAnalytics,
      icon: BarChart3,
      title: t.productAnalyticsTitle,
      desc: t.productAnalyticsDesc,
    },
  ];

  const closeMenu = () => setMenuOpen(false);

  // Navigation vers les pages indépendantes
  const navLinks = [
  ["/features", t.navFeatures],
  ["/how-it-works", t.navHow],
  ["/about", t.navAbout],
  ["/faq", t.navFaq],
];

  const activeProductData =
    productTabs.find((item) => item.id === activeProduct) || productTabs[0];

  const ActiveProductIcon = activeProductData.icon;

  return (
    <main className="landing-page">
      {/* ================= NAVBAR ================= */}
      <header className="lp-header">
        <div className="lp-container lp-header-inner">
          <Link to="/" className="lp-logo" onClick={closeMenu}>
            <span className="lp-logo-icon">
              <FolderKanban size={21} />
            </span>
            <span>
              Team<span>Flow</span>
            </span>
          </Link>

          <nav className={`lp-nav ${menuOpen ? "lp-nav-open" : ""}`}>
            {navLinks.map(([path, label]) => (
              <Link key={path} to={path} onClick={closeMenu}>
                {label}
              </Link>
            ))}

            <div className="lp-mobile-actions">
              <Link
                to="/login"
                className="lp-mobile-login"
                onClick={closeMenu}
              >
                {t.login}
              </Link>

              <Link
                to="/register"
                className="lp-mobile-register"
                onClick={closeMenu}
              >
                {t.register}
              </Link>
            </div>
          </nav>

          <div className="lp-header-actions">
            <button
              type="button"
              className="lp-language"
              onClick={() => setLanguage(isFr ? "EN" : "FR")}
              aria-label="Change language"
            >
              <span>{language}</span>
              <ChevronDown size={13} />
            </button>

            <Link to="/login" className="lp-login">
              {t.login}
            </Link>

            <Link to="/register" className="lp-header-cta">
              {t.register}
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <button
            type="button"
            className="lp-menu-toggle"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="lp-hero">
        <div className="lp-hero-grid-bg" />
        <div className="lp-hero-glow lp-glow-one" />
        <div className="lp-hero-glow lp-glow-two" />

        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-content">
            <div className="lp-eyebrow">
              <span className="lp-eyebrow-dot" />
              {t.badge}
            </div>

            <h1>
              {t.heroTitle1}
              <span>{t.heroTitle2}</span>
            </h1>

            <p className="lp-hero-description">
              {t.heroDescription}
            </p>

            <div className="lp-hero-buttons">
              <Link to="/register" className="lp-primary-button">
                {t.start}
                <ArrowRight size={18} />
              </Link>

              <Link to="/features" className="lp-secondary-button">
                {t.discover}
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="lp-hero-trust">
              <span className="lp-trust-icon">
                <ShieldCheck size={16} />
              </span>
              {t.trust}
            </div>

            <div className="lp-hero-mini-stats">
              <div>
                <strong>
                  <CheckCircle2 size={15} />
                  {t.done}
                </strong>
                <span>{isFr ? "Suivi organisé" : "Organized tracking"}</span>
              </div>

              <div>
                <strong>
                  <Users size={15} />
                  {t.work}
                </strong>
                <span>
                  {isFr ? "Responsabilités claires" : "Clear responsibilities"}
                </span>
              </div>
            </div>
          </div>

          {/* HERO PRODUCT PREVIEW */}
          <div className="lp-hero-visual">
            <div className="lp-preview-glow" />

            <div className="lp-preview-label">
              <span />
              {t.preview}
            </div>

            <div className="lp-dashboard-preview">
              <div className="lp-preview-topbar">
                <div className="lp-preview-brand">
                  <span>
                    <FolderKanban size={14} />
                  </span>
                  TeamFlow
                </div>

                <div className="lp-preview-top-right">
                  <span className="lp-preview-status">
                    <i />
                    {t.active}
                  </span>
                  <span className="lp-preview-avatar">TF</span>
                </div>
              </div>

              <div className="lp-preview-body">
                <aside className="lp-preview-sidebar">
                  <div className="lp-sidebar-workspace">
                    <span className="lp-workspace-icon">
                      <Layers3 size={14} />
                    </span>

                    <div>
                      <strong>{t.workspace}</strong>
                      <small>teamflow</small>
                    </div>
                  </div>

                  <span className="lp-sidebar-label">
                    {t.workspace}
                  </span>

                  <div className="lp-sidebar-link lp-sidebar-active">
                    <LayoutDashboard size={14} />
                    {t.overview}
                  </div>

                  <div className="lp-sidebar-link">
                    <FolderKanban size={14} />
                    {t.projects}
                  </div>

                  <div className="lp-sidebar-link">
                    <ListTodo size={14} />
                    {t.tasks}
                  </div>

                  <div className="lp-sidebar-link">
                    <Users size={14} />
                    {t.team}
                  </div>

                  <div className="lp-sidebar-link">
                    <BarChart3 size={14} />
                    {t.analytics}
                  </div>

                  <div className="lp-sidebar-bottom">
                    <ShieldCheck size={13} />
                    {isFr ? "Accès sécurisé" : "Secure access"}
                  </div>
                </aside>

                <div className="lp-preview-main">
                  <div className="lp-preview-heading">
                    <div>
                      <span>{t.today}</span>
                      <h3>{t.welcome}</h3>
                      <p>{t.overviewDesc}</p>
                    </div>

                    <div className="lp-preview-date">
                      <CalendarDays size={12} />
                      {isFr ? "Aujourd'hui" : "Today"}
                    </div>
                  </div>

                  <div className="lp-preview-stats">
                    <div className="lp-preview-stat">
                      <span className="lp-stat-icon purple">
                        <FolderKanban size={15} />
                      </span>
                      <small>{t.totalProjects}</small>
                      <strong>08</strong>
                      <span className="lp-stat-foot">
                        {t.inProgress}
                      </span>
                    </div>

                    <div className="lp-preview-stat">
                      <span className="lp-stat-icon green">
                        <CircleCheck size={15} />
                      </span>
                      <small>{t.completedTasks}</small>
                      <strong>24</strong>
                      <span className="lp-stat-foot">
                        {t.done}
                      </span>
                    </div>

                    <div className="lp-preview-stat">
                      <span className="lp-stat-icon orange">
                        <Users size={15} />
                      </span>
                      <small>{t.teamMembers}</small>
                      <strong>06</strong>
                      <span className="lp-stat-foot">
                        {t.work}
                      </span>
                    </div>
                  </div>

                  <div className="lp-preview-projects">
                    <div className="lp-preview-section-title">
                      <strong>{t.recentProjects}</strong>
                      <span>
                        {t.viewAll}
                        <ArrowRight size={11} />
                      </span>
                    </div>

                    {[
                      [t.projectOne, "72%", "violet"],
                      [t.projectTwo, "48%", "blue"],
                      [t.projectThree, "90%", "green"],
                    ].map(([name, percent, color]) => (
                      <div className="lp-preview-project" key={name}>
                        <div className="lp-project-line">
                          <span className={`lp-project-dot ${color}`} />
                          <strong>{name}</strong>
                          <small>{percent}</small>
                        </div>

                        <div className="lp-progress-track">
                          <span
                            className={color}
                            style={{ width: percent }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lp-preview-task">
                    <span className="lp-task-check">
                      <Check size={12} />
                    </span>

                    <div>
                      <strong>{t.taskDone}</strong>
                      <small>{t.assigned}</small>
                    </div>

                    <span className="lp-task-label">{t.done}</span>
                  </div>
                </div>
              </div>

              <div className="lp-preview-disclaimer">
                <span>
                  <Sparkles size={11} />
                  {t.sample}
                </span>
              </div>
            </div>

            <div className="lp-floating-card lp-floating-task">
              <span className="lp-floating-icon">
                <CheckCircle2 size={18} />
              </span>

              <div>
                <strong>{t.taskDone}</strong>
                <small>{t.taskDoneDesc}</small>
              </div>
            </div>

            <div className="lp-floating-card lp-floating-team">
              <div className="lp-avatar-stack">
                <span>FA</span>
                <span>AM</span>
                <span>YB</span>
              </div>

              <div>
                <strong>+3</strong>
                <small>{t.teamMembers}</small>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-hero-bottom">
          <div className="lp-container lp-hero-bottom-inner">
            <span>
              {isFr
                ? "UNE PLATEFORME POUR MIEUX AVANCER"
                : "A PLATFORM TO MOVE FORWARD"}
            </span>

            <div>
              <FolderKanban size={16} />
              {t.projects}
            </div>

            <div>
              <ClipboardList size={16} />
              {t.tasks}
            </div>

            <div>
              <Users size={16} />
              {t.team}
            </div>

            <div>
              <ChartNoAxesCombined size={16} />
              {t.analytics}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PLATFORM INTRO ================= */}
      <section className="lp-platform">
        <div className="lp-container">
          <div className="lp-platform-inner">
            <div className="lp-platform-copy">
              <span className="lp-section-eyebrow">
                {t.platformEyebrow}
              </span>

              <h2>{t.platformTitle}</h2>
              <p>{t.platformDesc}</p>
            </div>

            <div className="lp-platform-pills">
              <div>
                <span><FolderKanban size={18} /></span>
                <strong>{t.projects}</strong>
                <small>{isFr ? "Structurez le travail" : "Structure your work"}</small>
              </div>

              <div>
                <span><ListTodo size={18} /></span>
                <strong>{t.tasks}</strong>
                <small>{isFr ? "Suivez chaque tâche" : "Track every task"}</small>
              </div>

              <div>
                <span><Users size={18} /></span>
                <strong>{t.team}</strong>
                <small>{isFr ? "Coordonnez l'équipe" : "Coordinate your team"}</small>
              </div>

              <div>
                <span><BarChart3 size={18} /></span>
                <strong>{t.analytics}</strong>
                <small>{isFr ? "Visualisez l'activité" : "See your activity"}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="lp-section lp-features" id="features">
        <div className="lp-container">
          <div className="lp-section-heading">
            <span className="lp-section-eyebrow">{t.featuresEyebrow}</span>
            <h2>{t.featuresTitle}</h2>
            <p>{t.featuresDesc}</p>
          </div>

          <div className="lp-feature-grid">
            {[
              { icon: FolderKanban, title: t.feature1, desc: t.feature1Desc, color: "purple", featured: true },
              { icon: ClipboardList, title: t.feature2, desc: t.feature2Desc, color: "blue" },
              { icon: Users, title: t.feature3, desc: t.feature3Desc, color: "pink" },
              { icon: ChartNoAxesCombined, title: t.feature4, desc: t.feature4Desc, color: "green" },
              { icon: Bell, title: t.feature5, desc: t.feature5Desc, color: "orange" },
              { icon: ShieldCheck, title: t.feature6, desc: t.feature6Desc, color: "indigo" },
            ].map(({ icon: Icon, title, desc, color, featured }, index) => (
              <article
                className={`lp-feature-card ${featured ? "lp-feature-featured" : ""}`}
                key={title}
              >
                <div className="lp-feature-card-top">
                  <div className={`lp-feature-icon ${color}`}>
                    <Icon size={21} />
                  </div>
                  <span className="lp-feature-number">0{index + 1}</span>
                </div>

                <h3>{title}</h3>
                <p>{desc}</p>

                {featured && (
                  <div className="lp-feature-mini-ui">
                    <div className="lp-mini-project-row">
                      <span />
                      <div>
                        <strong>{t.projectOne}</strong>
                        <small>{t.inProgress}</small>
                      </div>
                      <b>72%</b>
                    </div>
                    <div className="lp-mini-progress"><span /></div>
                  </div>
                )}

                <div className="lp-feature-arrow">
                  <ArrowUpRight size={16} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="lp-section lp-how" id="how-it-works">
        <div className="lp-container">
          <div className="lp-section-heading">
            <span className="lp-section-eyebrow">{t.howEyebrow}</span>
            <h2>{t.howTitle}</h2>
            <p>{t.howDesc}</p>
          </div>

          <div className="lp-steps">
            {[
              { icon: FolderKanban, number: "01", title: t.step1, desc: t.step1Desc },
              { icon: Users, number: "02", title: t.step2, desc: t.step2Desc },
              { icon: Target, number: "03", title: t.step3, desc: t.step3Desc },
            ].map(({ icon: Icon, number, title, desc }, index) => (
              <article className="lp-step" key={number}>
                <div className="lp-step-line">
                  {index < 2 && <span />}
                </div>
                <div className="lp-step-top">
                  <span>{number}</span>
                  <div><Icon size={22} /></div>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCT SHOWCASE ================= */}
      <section className="lp-product-section">
        <div className="lp-container">
          <div className="lp-section-heading lp-product-heading">
            <span className="lp-section-eyebrow">{t.productEyebrow}</span>
            <h2>{t.productTitle}</h2>
            <p>{t.productDesc}</p>
          </div>

          <div className="lp-product-tabs">
            {productTabs.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  type="button"
                  key={item.id}
                  className={activeProduct === item.id ? "active" : ""}
                  onClick={() => setActiveProduct(item.id)}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="lp-showcase">
            <div className="lp-showcase-copy">
              <div className="lp-showcase-icon">
                <ActiveProductIcon size={21} />
              </div>
              <span className="lp-showcase-label">{activeProductData.label}</span>
              <h3>{activeProductData.title}</h3>
              <p>{activeProductData.desc}</p>

              <Link to="/register" className="lp-text-link">
                {t.productCta}
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="lp-showcase-ui">
              {activeProduct === "projects" && (
                <div className="lp-showcase-window">
                  <div className="lp-window-top">
                    <div>
                      <span className="lp-window-icon purple"><FolderKanban size={15} /></span>
                      <strong>{t.projects}</strong>
                    </div>
                    <span className="lp-window-action">{t.viewAll}</span>
                  </div>

                  <div className="lp-project-list">
                    {[
                      [t.projectOne, "72%", "purple", t.inProgress],
                      [t.projectTwo, "48%", "blue", t.pending],
                      [t.projectThree, "90%", "green", t.done],
                    ].map(([name, progress, color, status]) => (
                      <div className="lp-project-item" key={name}>
                        <div className="lp-project-item-main">
                          <span className={`lp-project-status-dot ${color}`} />
                          <div>
                            <strong>{name}</strong>
                            <small>{status}</small>
                          </div>
                        </div>
                        <div className="lp-project-item-progress">
                          <strong>{progress}</strong>
                          <div>
                            <span className={color} style={{ width: progress }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeProduct === "tasks" && (
                <div className="lp-showcase-window">
                  <div className="lp-window-top">
                    <div>
                      <span className="lp-window-icon blue"><ListTodo size={15} /></span>
                      <strong>{t.tasks}</strong>
                    </div>
                    <span className="lp-window-action">{t.viewAll}</span>
                  </div>

                  <div className="lp-task-list">
                    <div className="lp-task-item completed">
                      <span><Check size={12} /></span>
                      <div>
                        <strong>{isFr ? "Finaliser la page d'accueil" : "Finish homepage"}</strong>
                        <small>{t.done}</small>
                      </div>
                      <b>{t.done}</b>
                    </div>

                    <div className="lp-task-item">
                      <span />
                      <div>
                        <strong>{isFr ? "Préparer la présentation" : "Prepare presentation"}</strong>
                        <small>{t.priority}</small>
                      </div>
                      <b>{t.inProgress}</b>
                    </div>

                    <div className="lp-task-item">
                      <span />
                      <div>
                        <strong>{isFr ? "Vérifier les membres" : "Review team members"}</strong>
                        <small>{t.assigned}</small>
                      </div>
                      <b>{t.pending}</b>
                    </div>
                  </div>
                </div>
              )}

              {activeProduct === "team" && (
                <div className="lp-showcase-window">
                  <div className="lp-window-top">
                    <div>
                      <span className="lp-window-icon pink"><Users size={15} /></span>
                      <strong>{t.team}</strong>
                    </div>
                    <span className="lp-window-action">{isFr ? "Membres" : "Members"}</span>
                  </div>

                  <div className="lp-team-grid">
                    {[
                      ["FA", "Fatima", t.manager, "purple"],
                      ["AM", "Amine", t.member, "blue"],
                      ["YB", "Yassine", t.member, "green"],
                      ["SA", "Sara", t.admin, "orange"],
                    ].map(([initials, name, role, color]) => (
                      <div className="lp-team-card" key={name}>
                        <span className={`lp-team-avatar ${color}`}>{initials}</span>
                        <div>
                          <strong>{name}</strong>
                          <small>{role}</small>
                        </div>
                        <span className="lp-team-online"><i /></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeProduct === "analytics" && (
                <div className="lp-showcase-window">
                  <div className="lp-window-top">
                    <div>
                      <span className="lp-window-icon green"><BarChart3 size={15} /></span>
                      <strong>{t.analytics}</strong>
                    </div>
                    <span className="lp-window-action">{isFr ? "Vue globale" : "Overview"}</span>
                  </div>

                  <div className="lp-analytics-ui">
                    <div className="lp-analytics-stat">
                      <small>{t.totalProjects}</small>
                      <strong>08</strong>
                      <span><ArrowUpRight size={12} />{isFr ? "Progression" : "Progress"}</span>
                    </div>
                    <div className="lp-analytics-stat">
                      <small>{t.completedTasks}</small>
                      <strong>24</strong>
                      <span><Check size={12} />{t.done}</span>
                    </div>
                    <div className="lp-analytics-chart">
                      <div className="lp-chart-bars">
                        {[35, 52, 42, 67, 58, 78, 64, 88, 73, 94].map((height, index) => (
                          <span key={index} style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="lp-section lp-about" id="about">
        <div className="lp-container lp-about-grid">
          <div className="lp-about-visual">
            <div className="lp-about-glow" />

            <div className="lp-about-panel">
              <div className="lp-about-panel-top">
                <span className="lp-about-brand"><Sparkles size={15} /></span>
                <div>
                  <strong>TeamFlow</strong>
                  <small>{t.workspace}</small>
                </div>
                <span className="lp-about-online"><i />{t.active}</span>
              </div>

              <div className="lp-about-panel-content">
                <span className="lp-about-small-label">
                  {isFr ? "VOTRE ESPACE" : "YOUR WORKSPACE"}
                </span>

                <h3>
                  {isFr
                    ? "Le travail avance mieux ensemble."
                    : "Work moves forward together."}
                </h3>

                {[
                  [t.about1, CheckCircle2],
                  [t.about2, Users],
                  [t.about3, ChartNoAxesCombined],
                  [t.about4, ShieldCheck],
                ].map(([label, Icon]) => (
                  <div className="lp-about-check" key={label}>
                    <span><Icon size={15} /></span>
                    {label}
                  </div>
                ))}
              </div>

              <div className="lp-about-panel-footer">
                <span>
                  <LockKeyhole size={13} />
                  {isFr ? "Accès contrôlé" : "Controlled access"}
                </span>
                <span>
                  <Bell size={13} />
                  {isFr ? "Activité suivie" : "Activity tracked"}
                </span>
              </div>
            </div>

            <div className="lp-about-decoration lp-about-decoration-one" />
            <div className="lp-about-decoration lp-about-decoration-two" />
          </div>

          <div className="lp-about-copy">
            <span className="lp-section-eyebrow">{t.aboutEyebrow}</span>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutDesc}</p>

            <div className="lp-about-points">
              {[t.about1, t.about2, t.about3, t.about4].map((point) => (
                <div key={point}>
                  <span><Check size={14} /></span>
                  {point}
                </div>
              ))}
            </div>

            <Link to="/register" className="lp-primary-button">
              {t.start}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section className="lp-roles">
        <div className="lp-container">
          <div className="lp-section-heading">
            <span className="lp-section-eyebrow">{t.rolesEyebrow}</span>
            <h2>{t.rolesTitle}</h2>
            <p>{t.rolesDesc}</p>
          </div>

          <div className="lp-role-grid">
            <article className="lp-role-card">
              <span className="lp-role-number">01</span>
              <div className="lp-role-icon purple"><ShieldCheck size={21} /></div>
              <h3>{t.admin}</h3>
              <p>{t.adminDesc}</p>
            </article>

            <article className="lp-role-card lp-role-highlight">
              <span className="lp-role-number">02</span>
              <div className="lp-role-icon blue"><Target size={21} /></div>
              <h3>{t.manager}</h3>
              <p>{t.managerDesc}</p>
            </article>

            <article className="lp-role-card">
              <span className="lp-role-number">03</span>
              <div className="lp-role-icon green"><UserRound size={21} /></div>
              <h3>{t.member}</h3>
              <p>{t.memberDesc}</p>
            </article>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="lp-section lp-faq" id="faq">
        <div className="lp-container lp-faq-grid">
          <div className="lp-faq-heading">
            <span className="lp-section-eyebrow">{t.faqEyebrow}</span>
            <h2>{t.faqTitle}</h2>
            <p>{t.faqDesc}</p>

            <div className="lp-faq-help">
              <CircleHelp size={18} />
              <span>
                {isFr ? "Encore une question ?" : "Still have a question?"}
                <small>
                  {isFr
                    ? "Créez votre compte pour découvrir la plateforme."
                    : "Create your account to explore the platform."}
                </small>
              </span>
            </div>
          </div>

          <div className="lp-faq-list">
            {faqItems.map(([question, answer], index) => (
              <article
                className={`lp-faq-item ${activeFaq === index ? "lp-faq-active" : ""}`}
                key={question}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                  aria-expanded={activeFaq === index}
                >
                  <span className="lp-faq-question">
                    <small>0{index + 1}</small>
                    {question}
                  </span>
                  <span className="lp-faq-toggle"><ChevronDown size={17} /></span>
                </button>

                <div className={`lp-faq-answer ${activeFaq === index ? "open" : ""}`}>
                  <p>{answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="lp-cta">
        <div className="lp-cta-grid" />
        <div className="lp-cta-shape lp-cta-shape-one" />
        <div className="lp-cta-shape lp-cta-shape-two" />

        <div className="lp-container lp-cta-inner">
          <span>{t.ctaEyebrow}</span>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaDesc}</p>

          <div className="lp-cta-actions">
            <Link to="/register" className="lp-cta-button">
              {t.ctaButton}
              <ArrowRight size={18} />
            </Link>

            <Link to="/login" className="lp-cta-login">
              {t.ctaLogin}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-main">
            <div className="lp-footer-brand">
              <Link to="/" className="lp-logo" onClick={closeMenu}>
                <span className="lp-logo-icon">
                  <FolderKanban size={20} />
                </span>
                <span>
                  Team<span>Flow</span>
                </span>
              </Link>

              <p>{t.footerDesc}</p>
            </div>

            <div className="lp-footer-column">
              <h4>{t.footerProduct}</h4>
              <Link to="/features">{t.footerFeatures}</Link>
              <Link to="/how-it-works">{t.footerHow}</Link>
              <Link to="/faq">{t.footerFaq}</Link>
            </div>

            <div className="lp-footer-column">
              <h4>{t.footerCompany}</h4>
              <Link to="/about">{t.navAbout}</Link>
              <Link to="/features">{t.navFeatures}</Link>
              <Link to="/how-it-works">{t.navHow}</Link>
            </div>

            <div className="lp-footer-column">
              <h4>{t.footerAccount}</h4>
              <Link to="/login">{t.footerLogin}</Link>
              <Link to="/register">{t.footerRegister}</Link>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <span>
              © {new Date().getFullYear()} TeamFlow. {t.footerRights}
            </span>
            <span>
              {isFr
                ? "Conçu pour mieux collaborer."
                : "Designed for better collaboration."}
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
