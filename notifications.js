/* =====================================
   MELOSAV NOTIFICATIONS PAGE V1
===================================== */

console.log("NOTIFICATIONS PAGE LOADED");

document.addEventListener("DOMContentLoaded",()=>{

    if(typeof loadTheme==="function"){

        loadTheme();

    }

    loadNotifications();

    document.getElementById("markAllBtn")
    .addEventListener("click",markAll);

    document.getElementById("clearBtn")
    .addEventListener("click",clearAll);

});


/* =====================================
   LOAD NOTIFICATIONS
===================================== */

function loadNotifications(){

    const container=
    document.getElementById("notificationList");

    const notifications=
    getNotifications();

    if(notifications.length===0){

        container.innerHTML=`

        <div class="empty">

            <h2>🔔</h2>

            <p>No notifications yet.</p>

        </div>

        `;

        return;

    }

    container.innerHTML="";

    notifications.forEach(notification=>{

        const card=document.createElement("div");

        card.className=
        notification.read
        ? "notification-card"
        : "notification-card unread";

        card.innerHTML=`

            <h3>${notification.title}</h3>

            <p>${notification.message}</p>

            <small>${notification.time}</small>

            <button onclick="deleteOne(${notification.id})">

                Delete

            </button>

        `;

        card.onclick=()=>{

            markNotificationRead(notification.id);

            loadNotifications();

        };

        container.appendChild(card);

    });

}


/* =====================================
   DELETE ONE
===================================== */

function deleteOne(id){

    deleteNotification(id);

    loadNotifications();

    meloToast(

        "Deleted",

        "Notification removed.",

        "info"

    );

}


/* =====================================
   MARK ALL
===================================== */

function markAll(){

    markAllNotificationsRead();

    loadNotifications();

    meloToast(

        "Done",

        "All notifications marked as read.",

        "success"

    );

}


/* =====================================
   CLEAR ALL
===================================== */

function clearAll(){

    if(!confirm(

        "Delete all notifications?"

    )) return;

    clearNotifications();

    loadNotifications();

    meloToast(

        "Cleared",

        "All notifications removed.",

        "success"

    );

}