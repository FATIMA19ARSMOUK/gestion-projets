
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Check,
  FolderKanban,
  MessageSquare,
  UserPlus,
  Clock3,
  CircleCheck,
} from "lucide-react";
import { apiRequest } from "../services/api";
import "./Notifications.css";

// Convertir les données Laravel vers le format de l'interface
const formatNotification = (item) => {
  const typeMap = {
    member_left: "member",
    member_removed: "member",
    member_added: "member",
    task_assigned: "task",
    new_comment: "comment",
  };

  const titleMap = {
    task_assigned: "Nouvelle tâche assignée",
    new_comment: "Nouveau commentaire",
    member_added: "Ajout à un projet",
    member_left: "Départ d'un membre",
    member_removed: "Membre retiré du projet",
  };

  return {
    id: item.id,
    originalType: item.type,
    type: typeMap[item.type] || item.type,
    title: titleMap[item.type] || "Notification",
    message: item.message,
    time: item.created_at,
    read: Boolean(item.is_read),
  };
};

// Traduction des titres
const getNotificationTitle = (item, isFr) => {
  if (isFr) return item.title;

  const titles = {
    task_assigned: "New task assigned",
    new_comment: "New comment",
    member_added: "Added to a project",
    member_left: "A member left the project",
    member_removed: "Member removed from project",
  };

  return titles[item.originalType] || "Notification";
};

// Afficher la date relative
const formatTime = (date, isFr) => {
  if (!date) return "";

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "";

  const seconds = Math.floor((timestamp - Date.now()) / 1000);

  const formatter = new Intl.RelativeTimeFormat(
    isFr ? "fr" : "en",
    { numeric: "auto" }
  );

  const units = [
    { limit: 60, value: 1, unit: "second" },
    { limit: 3600, value: 60, unit: "minute" },
    { limit: 86400, value: 3600, unit: "hour" },
    { limit: 604800, value: 86400, unit: "day" },
  ];

  const absoluteSeconds = Math.abs(seconds);

  for (const item of units) {
    if (absoluteSeconds < item.limit) {
      return formatter.format(
        Math.round(seconds / item.value),
        item.unit
      );
    }
  }

  return new Date(date).toLocaleDateString(
    isFr ? "fr-FR" : "en-US"
  );
};

// Icônes par type
const notificationIcons = {
  task: CheckCheck,
  comment: MessageSquare,
  project: FolderKanban,
  member: UserPlus,
};

// Couleurs par type
const notificationColors = {
  task: "notification-icon-blue",
  comment: "notification-icon-purple",
  project: "notification-icon-green",
  member: "notification-icon-orange",
};

export default function Notifications() {
  const { language } = useOutletContext() || {};
  const isFr = language !== "en";

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Charger les notifications depuis Laravel
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest("/notifications");

        setNotifications(
          Array.isArray(data)
            ? data.map(formatNotification)
            : []
        );
      } catch (error) {
        console.error("Erreur de chargement des notifications :", error);
        setError(
          error.message || "Erreur de chargement des notifications."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "read") return item.read;
    return true;
  });

  // Marquer une notification comme lue
  const markAsRead = async (id) => {
    try {
      setUpdatingId(id);
      setError("");

      await apiRequest(`/notifications/${id}/read`, {
        method: "PATCH",
      });

      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, read: true } : item
        )
      );
    } catch (error) {
      console.error("Erreur lors de la lecture :", error);
      setError(error.message || "Impossible de modifier la notification.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      setIsMarkingAll(true);
      setError("");

      await apiRequest("/notifications/read-all", {
        method: "PATCH",
      });

      setNotifications((current) =>
        current.map((item) => ({ ...item, read: true }))
      );
    } catch (error) {
      console.error("Erreur lors de la lecture des notifications :", error);
      setError(error.message || "Impossible de modifier les notifications.");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const filterLabels = {
    all: isFr ? "Toutes" : "All",
    unread: isFr ? "Non lues" : "Unread",
    read: isFr ? "Lues" : "Read",
  };

  return (
    <main className="notifications-page">
      <header className="notifications-header">
        <div>
          <div className="notifications-eyebrow">
            <Bell size={15} />
            {isFr ? "CENTRE D'ACTIVITÉ" : "ACTIVITY CENTER"}
          </div>

          <h1>Notifications</h1>

          <p>
            {isFr
              ? "Restez informé des activités de votre équipe."
              : "Stay informed about your team's activity."}
          </p>
        </div>

        <button
          type="button"
          className="notifications-mark-all"
          onClick={markAllAsRead}
          disabled={unreadCount === 0 || isMarkingAll}
        >
          <CheckCheck size={17} />

          {isMarkingAll
            ? isFr
              ? "Traitement..."
              : "Processing..."
            : isFr
              ? "Tout marquer comme lu"
              : "Mark all as read"}
        </button>
      </header>

      {error && (
        <p role="alert" className="notifications-error">
          {error}
        </p>
      )}

      <section className="notifications-stats">
        <article className="notifications-stat-card">
          <span className="notifications-stat-icon notifications-stat-blue">
            <Bell size={20} />
          </span>

          <div>
            <p>
              {isFr ? "Total des notifications" : "Total notifications"}
            </p>
            <strong>{notifications.length}</strong>
          </div>
        </article>

        <article className="notifications-stat-card">
          <span className="notifications-stat-icon notifications-stat-orange">
            <Clock3 size={20} />
          </span>

          <div>
            <p>{isFr ? "Non lues" : "Unread"}</p>
            <strong>{unreadCount}</strong>
          </div>
        </article>

        <article className="notifications-stat-card">
          <span className="notifications-stat-icon notifications-stat-green">
            <CircleCheck size={20} />
          </span>

          <div>
            <p>{isFr ? "Lues" : "Read"}</p>
            <strong>{notifications.length - unreadCount}</strong>
          </div>
        </article>
      </section>

      <section className="notifications-panel">
        <div className="notifications-toolbar">
          <div className="notifications-toolbar-title">
            <h2>{isFr ? "Activité récente" : "Recent activity"}</h2>

            <p>
              {filteredNotifications.length}{" "}
              {isFr ? "notification(s)" : "notification(s)"}
            </p>
          </div>

          <div className="notifications-filters">
            {Object.entries(filterLabels).map(([key, label]) => (
              <button
                type="button"
                key={key}
                className={`notifications-filter ${
                  filter === key ? "notifications-filter-active" : ""
                }`}
                onClick={() => setFilter(key)}
              >
                {label}

                {key === "unread" && unreadCount > 0 && (
                  <span className="notifications-filter-count">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="notifications-list">
          {isLoading ? (
            <div className="notifications-empty">
              <p>
                {isFr
                  ? "Chargement des notifications..."
                  : "Loading notifications..."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const Icon = notificationIcons[item.type] || Bell;

              const iconColor =
                notificationColors[item.type] || "notification-icon-blue";

              return (
                <article
                  key={item.id}
                  className={`notification-item ${
                    !item.read ? "notification-unread" : ""
                  }`}
                >
                  <span className={`notification-type-icon ${iconColor}`}>
                    <Icon size={19} />
                  </span>

                  <div className="notification-content">
                    <div className="notification-title-row">
                      <h3>{getNotificationTitle(item, isFr)}</h3>

                      {!item.read && (
                        <span className="notification-unread-dot" />
                      )}
                    </div>

                    <p>{item.message}</p>

                    <span className="notification-time">
                      <Clock3 size={13} />
                      {formatTime(item.time, isFr)}
                    </span>
                  </div>

                  <div className="notification-actions">
                    {!item.read ? (
                      <button
                        type="button"
                        className="notification-read-button"
                        onClick={() => markAsRead(item.id)}
                        disabled={updatingId === item.id}
                      >
                        <Check size={15} />

                        {updatingId === item.id
                          ? isFr
                            ? "Traitement..."
                            : "Processing..."
                          : isFr
                            ? "Marquer comme lu"
                            : "Mark as read"}
                      </button>
                    ) : (
                      <span className="notification-read-label">
                        <Check size={15} />
                        {isFr ? "Lu" : "Read"}
                      </span>
                    )}
                  </div>
                </article>
              );
            })
          )}

          {!isLoading && filteredNotifications.length === 0 && (
            <div className="notifications-empty">
              <span>
                <Bell size={24} />
              </span>

              <h3>
                {isFr ? "Aucune notification" : "No notifications"}
              </h3>

              <p>
                {isFr
                  ? "Aucune notification dans cette catégorie."
                  : "There are no notifications in this category."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
