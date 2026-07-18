/* =====================================
   MELOSAV SERVICE WORKER V1
===================================== */

const CACHE_NAME = "melosav-v5.0.0";

const FILES_TO_CACHE = [

  "./",

  "./index.html",
  "./login.html",
  "./signup.html",
  "./home.html",
  "./goals.html",
  "./profile.html",
  "./settings.html",
  "./theme-setup.html",

  "./theme.css",
  "./home.css",
  "./goals.css",
  "./profile.css",
  "./settings.css",
  "./theme-setup.css",
  "./melo-toast.css",

  "./storage.js",
  "./theme.js",
  "./home.js",
  "./goals.js",
  "./profile.js",
  "./settings.js",
  "./theme-setup.js",
  "./melo-toast.js",

  "./logo.png",

  "./icons/icon-192.png",
  "./icons/icon-512.png"

];


/* ===============================
   INSTALL
================================ */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => cache.addAll(FILES_TO_CACHE))

    );

    self.skipWaiting();

});


/* ===============================
   ACTIVATE
================================ */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        return caches.delete(key);

                    }

                })

            )

        )

    );

    self.clients.claim();

});


/* ===============================
   FETCH
================================ */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            return response || fetch(event.request);

        })

    );

});