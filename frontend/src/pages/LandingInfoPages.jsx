
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FolderKanban,
  Users,
  Bell,
  ShieldCheck,
  Target,
  Zap,
  MessageSquare,
  BarChart3,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

import "./LandingInfoPages.css";

/* =========================================================
   DATA
========================================================= */

const features = [
  {
    icon: FolderKanban,
    number: "01",
    title: "Project management",
    description:
      "Bring all your projects into one organized workspace. Keep goals, deadlines and team responsibilities clear.",
    tag: "Stay organized",
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "Smart task tracking",
    description:
      "Break projects into manageable tasks, assign owners and follow every step from start to finish.",
    tag: "Move work forward",
  },
  {
    icon: Users,
    number: "03",
    title: "Team collaboration",
    description:
      "Give everyone a clear view of their responsibilities and make teamwork easier every day.",
    tag: "Work together",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Progress overview",
    description:
      "Understand what's happening across your projects with a clear and useful dashboard.",
    tag: "See the big picture",
  },
  {
    icon: Bell,
    number: "05",
    title: "Activity notifications",
    description:
      "Keep up with important updates and changes without having to check everything manually.",
    tag: "Stay informed",
  },
  {
    icon: ShieldCheck,
    number: "06",
    title: "Roles & permissions",
    description:
      "Keep your workspace structured with access levels designed around team responsibilities.",
    tag: "Work with confidence",
  },
];

const steps = [
  {
    number: "01",
    icon: Users,
    title: "Bring your team together",
    description:
      "Create your account and give your team one shared place to organize and manage work.",
  },
  {
    number: "02",
    icon: FolderKanban,
    title: "Create your projects",
    description:
      "Set up projects, add descriptions and deadlines, then assign the right people.",
  },
  {
    number: "03",
    icon: ClipboardList,
    title: "Turn plans into tasks",
    description:
      "Break your goals into actionable tasks, set priorities and track their status.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track progress together",
    description:
      "Follow activity from your dashboard and keep everyone aligned as work moves forward.",
  },
];

const values = [
  {
    icon: Target,
    title: "Clarity first",
    description:
      "We believe great teamwork starts when everyone understands what needs to be done.",
  },
  {
    icon: Zap,
    title: "Less complexity",
    description:
      "Project management should make work easier, not add another layer of complexity.",
  },
  {
    icon: Users,
    title: "Better together",
    description:
      "A shared workspace helps people coordinate, communicate and achieve goals together.",
  },
];

const faqs = [
  {
    question: "What is TeamFlow?",
    answer:
      "TeamFlow is a collaborative project management platform that helps teams organize projects, manage tasks and follow progress in one workspace.",
  },
  {
    question: "Who is TeamFlow designed for?",
    answer:
      "TeamFlow is designed for teams and organizations that want a clearer way to plan projects, coordinate tasks and manage their work.",
  },
  {
    question: "Can I assign tasks to team members?",
    answer:
      "Yes. Tasks can be assigned to team members so responsibilities are clear and everyone knows what they need to work on.",
  },
  {
    question: "Can I follow the progress of my projects?",
    answer:
      "Yes. You can follow project and task statuses and use the dashboard to get an overview of ongoing work.",
  },
  {
    question: "Does TeamFlow support different user roles?",
    answer:
      "Yes. TeamFlow uses roles and permissions to organize access according to each user's responsibilities.",
  },
  {
    question: "How can I get started?",
    answer:
      "Create an account using the Get started button. Once registered, you can access your workspace and begin organizing your projects.",
  },
];

/* =========================================================
   NAVBAR
========================================================= */

function PageNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: "Home", path: "/", end: true },
    { label: "Features", path: "/features" },
    { label: "How it works", path: "/how-it-works" },
    { label: "About", path: "/about" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
    <header className="inner-navbar">
      <div className="inner-navbar-container">

        <Link to="/" className="inner-brand" onClick={closeMenu}>
          <span className="inner-brand-icon">
            <FolderKanban size={22} />
          </span>
          <span>TeamFlow</span>
        </Link>

        <nav
          className={`inner-nav-links ${menuOpen ? "open" : ""}`}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "inner-nav-active" : ""
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={`inner-nav-actions ${menuOpen ? "open" : ""}`}>
          <Link
            to="/login"
            className="inner-login-link"
            onClick={closeMenu}
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="inner-start-button"
            onClick={closeMenu}
          >
            Get started
            <ArrowRight size={16} />
          </Link>
        </div>

        <button
          type="button"
          className="inner-menu-toggle"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

      </div>
    </header>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function PageFooter() {
  return (
    <footer className="inner-footer">
      <div className="inner-footer-main">

        <div className="inner-footer-brand">
          <Link to="/" className="inner-brand">
            <span className="inner-brand-mark">
              <FolderKanban size={20} strokeWidth={2.3} />
            </span>
            <span>
              team<span>flow</span>
            </span>
          </Link>

          <p>
            A clearer way to manage projects and work better together.
          </p>
        </div>

        <div className="inner-footer-links">

          <div>
            <span className="inner-footer-heading">Explore</span>
            <Link to="/features">Features</Link>
            <Link to="/how-it-works">How it works</Link>
          </div>

          <div>
            <span className="inner-footer-heading">Company</span>
            <Link to="/about">About</Link>
            <Link to="/faq">FAQ</Link>
          </div>

          <div>
            <span className="inner-footer-heading">Get started</span>
            <Link to="/login">Log in</Link>
            <Link to="/register">Create account</Link>
          </div>

        </div>
      </div>

      <div className="inner-footer-bottom">
        <span>
          © {new Date().getFullYear()} TeamFlow. All rights reserved.
        </span>
        <span>Made for better teamwork.</span>
      </div>
    </footer>
  );
}

/* =========================================================
   SHARED LAYOUT
========================================================= */

function PageLayout({ children }) {
  return (
    <div className="inner-page">
      <PageNavbar />
      <main>{children}</main>
      <PageFooter />
    </div>
  );
}

/* =========================================================
   PAGE HERO
========================================================= */

function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  children,
}) {
  return (
    <section className="inner-hero">
      <div className="inner-hero-glow" />

      <div className="inner-hero-content">
        <span className="inner-eyebrow">
          <span className="inner-eyebrow-dot" />
          {eyebrow}
        </span>

        <h1>
          {title} <span>{highlight}</span>
        </h1>

        <p>{description}</p>

        {children}
      </div>
    </section>
  );
}

/* =========================================================
   DASHBOARD PREVIEW
========================================================= */

function DashboardPreview() {
  return (
    <div className="preview-wrap">
      <div className="preview-window">

        <div className="preview-topbar">
          <div className="preview-brand">
            <span className="preview-brand-icon">
              <FolderKanban size={15} />
            </span>
            <strong>teamflow</strong>
          </div>

          <div className="preview-top-right">
            <span className="preview-top-avatar">TF</span>
            <span className="preview-top-avatar preview-avatar-two">
              AM
            </span>
          </div>
        </div>

        <div className="preview-body">

          <aside className="preview-sidebar">
            <span className="preview-side-label">WORKSPACE</span>

            <div className="preview-side-item preview-side-active">
              <LayoutDashboard size={14} />
              Overview
            </div>

            <div className="preview-side-item">
              <FolderKanban size={14} />
              Projects
            </div>

            <div className="preview-side-item">
              <ClipboardList size={14} />
              My tasks
            </div>

            <div className="preview-side-item">
              <Users size={14} />
              Team
            </div>
          </aside>

          <div className="preview-main">

            <div className="preview-heading">
              <div>
                <span>YOUR WORKSPACE</span>
                <h3>Good morning, team</h3>
                <p>Here's what's happening with your workspace.</p>
              </div>

              <div className="preview-add">
                + New project
              </div>
            </div>

            <div className="preview-stats">

              <div className="preview-stat">
                <span>Active projects</span>
                <strong>08</strong>
                <small>
                  <Check size={11} />
                  On track
                </small>
              </div>

              <div className="preview-stat">
                <span>Tasks completed</span>
                <strong>24</strong>
                <small>
                  <Check size={11} />
                  This month
                </small>
              </div>

              <div className="preview-stat">
                <span>Team members</span>
                <strong>12</strong>
                <small>
                  <Users size={11} />
                  Collaborating
                </small>
              </div>

            </div>

            <div className="preview-project-heading">
              <strong>Recent projects</strong>
              <span>
                View all <ArrowRight size={11} />
              </span>
            </div>

            <div className="preview-project">
              <div className="preview-project-icon purple">
                <FolderKanban size={15} />
              </div>

              <div className="preview-project-info">
                <strong>Website redesign</strong>
                <span>Marketing team</span>
              </div>

              <div className="preview-progress">
                <strong>75%</strong>
                <div>
                  <i style={{ width: "75%" }} />
                </div>
              </div>

              <span className="preview-status">In progress</span>
            </div>

            <div className="preview-project">
              <div className="preview-project-icon orange">
                <Target size={15} />
              </div>

              <div className="preview-project-info">
                <strong>Mobile application</strong>
                <span>Product team</span>
              </div>

              <div className="preview-progress">
                <strong>45%</strong>
                <div>
                  <i style={{ width: "45%" }} />
                </div>
              </div>

              <span className="preview-status preview-status-orange">
                In progress
              </span>
            </div>

          </div>
        </div>
      </div>

      <div className="preview-floating-card preview-float-one">
        <span className="preview-float-icon">
          <CheckCircle2 size={17} />
        </span>

        <div>
          <strong>Task completed</strong>
          <small>Design homepage</small>
        </div>
      </div>

      <div className="preview-floating-card preview-float-two">
        <span className="preview-float-icon preview-float-purple">
          <Users size={17} />
        </span>

        <div>
          <strong>Team collaboration</strong>
          <small>12 members active</small>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FEATURES PAGE
========================================================= */

export function FeaturesPage() {
  return (
    <PageLayout>

      <PageHero
        eyebrow="POWERFUL FEATURES"
        title="Everything your team needs."
        highlight="All in one place."
        description="From planning projects to tracking progress, TeamFlow gives your team the tools to stay organized and get meaningful work done."
      >
        <div className="inner-hero-actions">
          <Link to="/register" className="inner-primary-button">
            Explore your workspace
            <ArrowRight size={17} />
          </Link>

          <Link to="/how-it-works" className="inner-secondary-button">
            See how it works
          </Link>
        </div>
      </PageHero>

      <section className="inner-section inner-feature-section">

        <div className="inner-section-heading">
          <span className="inner-eyebrow">
            BUILT FOR YOUR WORKFLOW
          </span>

          <h2>
            Everything works better <span>together.</span>
          </h2>

          <p>
            A connected set of tools that keeps your projects, tasks and people
            moving in the same direction.
          </p>
        </div>

        <div className="inner-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="inner-feature-card"
                key={feature.number}
              >
                <div className="inner-feature-card-top">
                  <span className="inner-feature-icon">
                    <Icon size={22} />
                  </span>

                  <span className="inner-feature-number">
                    {feature.number}
                  </span>
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <span className="inner-feature-tag">
                  <CheckCircle2 size={14} />
                  {feature.tag}
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="inner-showcase">

        <div className="inner-showcase-copy">
          <span className="inner-eyebrow">
            YOUR WORKSPACE, SIMPLIFIED
          </span>

          <h2>
            See the whole picture. <span>Stay in control.</span>
          </h2>

          <p>
            Get a clear overview of your projects, tasks and team activity.
            Spend less time searching for updates and more time making progress.
          </p>

          <ul className="inner-check-list">
            <li>
              <CheckCircle2 size={17} />
              One place for your project activity
            </li>
            <li>
              <CheckCircle2 size={17} />
              Clear task ownership and status
            </li>
            <li>
              <CheckCircle2 size={17} />
              A dashboard that keeps you informed
            </li>
          </ul>

          <Link to="/register" className="inner-text-link">
            Get started with TeamFlow
            <ArrowRight size={16} />
          </Link>
        </div>

        <DashboardPreview />
      </section>

      <CallToAction />

    </PageLayout>
  );
}

/* =========================================================
   HOW IT WORKS PAGE
========================================================= */

export function HowItWorksPage() {
  return (
    <PageLayout>

      <PageHero
        eyebrow="A SIMPLE WAY TO WORK"
        title="From scattered tasks"
        highlight="to shared progress."
        description="Getting organized shouldn't be complicated. TeamFlow gives your team a simple process to plan, coordinate and move projects forward."
      >
        <div className="inner-hero-actions">
          <Link to="/register" className="inner-primary-button">
            Start working together
            <ArrowRight size={17} />
          </Link>
        </div>
      </PageHero>

      <section className="inner-section inner-process-section">

        <div className="inner-section-heading">
          <span className="inner-eyebrow">
            FOUR SIMPLE STEPS
          </span>

          <h2>
            A better workflow, <span>step by step.</span>
          </h2>

          <p>
            Everything your team needs to get from the first idea to completed work.
          </p>
        </div>

        <div className="inner-process-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                className="inner-process-card"
                key={step.number}
              >
                <div className="inner-process-top">
                  <span className="inner-process-icon">
                    <Icon size={23} />
                  </span>

                  <span className="inner-process-number">
                    {step.number}
                  </span>
                </div>

                {index !== steps.length - 1 && (
                  <div className="inner-process-line" />
                )}

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="inner-workspace-band">

        <div>
          <span className="inner-eyebrow">
            ONE SHARED WORKSPACE
          </span>

          <h2>Everyone knows what matters next.</h2>

          <p>
            Keep tasks visible, responsibilities clear and project updates
            accessible to the people who need them.
          </p>
        </div>

        <div className="inner-workspace-visual">
          <div className="workspace-mini-card">

            <div className="workspace-mini-head">
              <span>
                <ClipboardList size={16} />
                Today&apos;s tasks
              </span>

              <span className="workspace-mini-count">03</span>
            </div>

            <div className="workspace-task">
              <span className="workspace-task-check">
                <Check size={12} />
              </span>

              <span>Review project brief</span>
              <small>Done</small>
            </div>

            <div className="workspace-task">
              <span className="workspace-task-check workspace-task-empty" />
              <span>Prepare design draft</span>
              <small className="workspace-task-active">
                In progress
              </small>
            </div>

            <div className="workspace-task">
              <span className="workspace-task-check workspace-task-empty" />
              <span>Team feedback</span>
              <small>To do</small>
            </div>

          </div>
        </div>
      </section>

      <CallToAction />

    </PageLayout>
  );
}

/* =========================================================
   ABOUT PAGE
========================================================= */

export function AboutPage() {
  return (
    <PageLayout>

      <PageHero
        eyebrow="ABOUT TEAMFLOW"
        title="Better teamwork starts"
        highlight="with clarity."
        description="TeamFlow is built around a simple idea: when teams have a clear place to organize their work, collaboration becomes easier and progress becomes visible."
      >
        <div className="inner-hero-actions">
          <Link to="/features" className="inner-primary-button">
            Discover our features
            <ArrowRight size={17} />
          </Link>
        </div>
      </PageHero>

      <section className="inner-about-intro">

        <div className="inner-about-label">
          <span className="inner-eyebrow">OUR PURPOSE</span>
          <span className="inner-about-big-number">01</span>
        </div>

        <div className="inner-about-copy">
          <h2>
            Make collaboration feel <span>simple and natural.</span>
          </h2>

          <p>
            Managing projects often means switching between tools, searching
            for information and trying to understand who&apos;s doing what.
          </p>

          <p>
            TeamFlow brings projects, tasks and team coordination into one
            shared workspace. It helps teams stay aligned, understand
            priorities and keep work moving forward.
          </p>
        </div>

      </section>

      <section className="inner-section inner-values-section">

        <div className="inner-section-heading">
          <span className="inner-eyebrow">
            WHAT GUIDES US
          </span>

          <h2>
            Designed around <span>better teamwork.</span>
          </h2>

          <p>
            The principles behind a workspace that helps teams do their best work.
          </p>
        </div>

        <div className="inner-values-grid">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                className="inner-value-card"
                key={value.title}
              >
                <span className="inner-value-icon">
                  <Icon size={23} />
                </span>

                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="inner-about-statement">
        <span className="inner-eyebrow">
          THE TEAMFLOW APPROACH
        </span>

        <h2>
          Less confusion. More focus. <span>Better results.</span>
        </h2>

        <p>
          A shared space for the people, plans and progress that make every project happen.
        </p>
      </section>

      <CallToAction />

    </PageLayout>
  );
}

/* =========================================================
   FAQ PAGE
========================================================= */

export function FAQPage() {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <PageLayout>

      <PageHero
        eyebrow="HELP CENTER"
        title="Questions?"
        highlight="We've got answers."
        description="Everything you need to know about TeamFlow, how it works and how to get started with your team."
      >
        <div className="inner-hero-actions">
          <a href="#faq-list" className="inner-primary-button">
            Browse questions
            <ArrowRight size={17} />
          </a>
        </div>
      </PageHero>

      <section className="inner-faq-section" id="faq-list">

        <div className="inner-faq-aside">
          <span className="inner-eyebrow">
            FREQUENTLY ASKED
          </span>

          <h2>Find the answers you&apos;re looking for.</h2>

          <p>
            Can&apos;t find what you need? Explore TeamFlow or create your account
            to get started.
          </p>

          <Link to="/register" className="inner-text-link">
            Get started
            <ArrowRight size={16} />
          </Link>

          <div className="inner-faq-help-card">
            <span className="inner-faq-help-icon">
              <MessageSquare size={20} />
            </span>

            <strong>Still have questions?</strong>

            <p>
              Discover how TeamFlow helps your team stay organized.
            </p>

            <Link to="/features">
              Explore features
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <div className="inner-faq-list">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;

            return (
              <article
                className={`inner-faq-item ${
                  isOpen ? "inner-faq-open" : ""
                }`}
                key={faq.question}
              >
                <button
                  type="button"
                  className="inner-faq-question"
                  onClick={() =>
                    setActiveFaq(isOpen ? -1 : index)
                  }
                  aria-expanded={isOpen}
                >
                  <span className="inner-faq-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <strong>{faq.question}</strong>

                  <span className="inner-faq-chevron">
                    <ChevronDown size={18} />
                  </span>
                </button>

                {isOpen && (
                  <div className="inner-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

      </section>

      <CallToAction />

    </PageLayout>
  );
}

/* =========================================================
   SHARED CALL TO ACTION
========================================================= */

function CallToAction() {
  return (
    <section className="inner-cta">
      <div className="inner-cta-glow" />

      <div className="inner-cta-content">
        <span className="inner-cta-label">
          YOUR NEXT CHAPTER STARTS HERE
        </span>

        <h2>
          Make room for <span>great work.</span>
        </h2>

        <p>
          Bring your team, projects and tasks together with TeamFlow.
        </p>

        <Link to="/register" className="inner-cta-button">
          Get started for free
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}
