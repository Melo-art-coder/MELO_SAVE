/* =====================================
   MELOSAV NOTIFICATIONS V5
===================================== */

console.log("NOTIFICATIONS V5 LOADED");

const NOTIFICATION_KEY = "meloNotifications";

/* ==========================
   GET NOTIFICATIONS
========================== */

function getNotifications(){

    return JSON.parse(
        localStorage.getItem(NOTIFICATION_KEY)
    ) || [];

}


/* ==========================
   SAVE NOTIFICATIONS
========================== */

function saveNotifications(list){

    localStorage.setItem(
        NOTIFICATION_KEY,
        JSON.stringify(list)
    );

}


/* ==========================
   ADD NOTIFICATION
========================== */

function addNotification(title,message,type="info"){

    const notifications =
        getNotifications();

    notifications.unshift({

        id:Date.now(),

        title,

        message,

        type,

        read:false,

        time:new Date().toLocaleString()

    });

    saveNotifications(notifications);

}


/* ==========================
   MARK AS READ
========================== */

function markNotificationRead(id){

    const notifications =
        getNotifications();

    notifications.forEach(notification=>{

        if(notification.id===id){

            notification.read=true;

        }

    });

    saveNotifications(notifications);

}


/* ==========================
   MARK ALL AS READ
========================== */

function markAllNotificationsRead(){

    const notifications =
        getNotifications();

    notifications.forEach(notification=>{

        notification.read=true;

    });

    saveNotifications(notifications);

}


/* ==========================
   DELETE NOTIFICATION
========================== */

function deleteNotification(id){

    const notifications =
        getNotifications().filter(

            notification=>notification.id!==id

        );

    saveNotifications(notifications);

}


/* ==========================
   CLEAR ALL
========================== */

function clearNotifications(){

    localStorage.removeItem(
        NOTIFICATION_KEY
    );

}


/* ==========================
   UNREAD COUNT
========================== */

function getUnreadCount(){

    return getNotifications().filter(

        notification=>!notification.read

    ).length;

}


/* ==========================
   SAMPLE NOTIFICATIONS
========================== */

if(getNotifications().length===0){

    addNotification(
        "👋 Welcome",
        "Welcome to MELOSAV! Start your savings journey today.",
        "success"
    );

    addNotification(
        "💜 Melo AI",
        "Remember: Every naira saved today helps your future.",
        "info"
    );

}