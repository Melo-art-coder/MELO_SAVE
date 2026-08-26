/* =====================================
   MELOSAV NOTIFICATIONS
===================================== */

console.log("🔔 NOTIFICATIONS LOADED");

let notificationUser = null;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        notificationUser = getCurrentUser();

        if (!notificationUser) {

            location.href = "login.html";

            return;

        }

        loadNotifications();

        setupNotificationButtons();

    }
);


/* =====================================
   LOAD
===================================== */

function loadNotifications() {

    const container =
        document.getElementById(
            "notificationList"
        );

    if (!container) return;


    const notifications =
        Array.isArray(
            notificationUser.notifications
        )
            ? notificationUser.notifications
            : [];


    if (notifications.length === 0) {

        container.innerHTML = `

            <div class="empty-notifications">

                <div>🔔</div>

                <h2>No notifications</h2>

                <p>
                    Melo will let you know when something happens.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    notifications.forEach(
        notification => {

            const card =
                document.createElement("div");

            card.className =
                "notification-card" +
                (
                    notification.read
                    ? ""
                    : " unread"
                );


            card.innerHTML = `

                <div class="notification-icon">

                    ${getNotificationIcon(
                        notification.type
                    )}

                </div>


                <div class="notification-content">

                    <h3>
                        ${escapeHTML(
                            notification.title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            notification.message
                        )}
                    </p>

                    <div class="notification-time">

                        ${formatNotificationDate(
                            notification.date
                        )}

                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    markAsRead(
                        notification.id
                    );

                }
            );


            container.appendChild(card);

        }
    );

}


/* =====================================
   READ
===================================== */

function markAsRead(id) {

    const user = getCurrentUser();

    if (!user) return;


    const notification =
        (user.notifications || [])
        .find(
            item => item.id === id
        );


    if (!notification) return;


    notification.read = true;


    updateCurrentUser(user);

    notificationUser = user;

    loadNotifications();

}


/* =====================================
   BUTTONS
===================================== */

function setupNotificationButtons() {

    const markAll =
        document.getElementById(
            "markAllRead"
        );

    const clear =
        document.getElementById(
            "clearNotifications"
        );


    if (markAll) {

        markAll.addEventListener(
            "click",
            () => {

                markAllNotificationsRead();

                notificationUser =
                    getCurrentUser();

                loadNotifications();

                meloToast(
                    "✓ All Read",
                    "All notifications marked as read.",
                    "success"
                );

            }
        );

    }


    if (clear) {

        clear.addEventListener(
            "click",
            () => {

                if (
                    !confirm(
                        "Clear all notifications?"
                    )
                ) return;


                const user =
                    getCurrentUser();

                if (!user) return;


                user.notifications = [];

                updateCurrentUser(user);

                notificationUser = user;

                loadNotifications();


                meloToast(
                    "🗑 Notifications Cleared",
                    "Your notification history was cleared.",
                    "info"
                );

            }
        );

    }

}


/* =====================================
   ICONS
===================================== */

function getNotificationIcon(type) {

    const icons = {

        income:"💰",

        expense:"💸",

        savings:"🏦",

        goal:"🎯",

        success:"🎉",

        info:"💜",

        warning:"⚠️",

        error:"❌"

    };


    return icons[type] || "🔔";

}


/* =====================================
   DATE
===================================== */

function formatNotificationDate(date) {

    const parsed =
        new Date(date);

    if (
        !date ||
        isNaN(parsed.getTime())
    ) {

        return "Recently";

    }


    return parsed.toLocaleString(
        "en-NG",
        {
            day:"numeric",
            month:"short",
            hour:"numeric",
            minute:"2-digit"
        }
    );

}


/* =====================================
   ESCAPE
===================================== */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


console.log("✅ NOTIFICATIONS READY");
