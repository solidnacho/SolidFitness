const CACHE_NAME = "solidfitness-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./apps.js",
    "./manifest.json"
];


self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(function(cache) {

                return cache.addAll(FILES_TO_CACHE);

            })

    );

});


self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request)
            .then(function(response) {

                return response || fetch(event.request);

            })

    );

});


self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys()
            .then(function(cacheNames) {

                return Promise.all(

                    cacheNames
                        .filter(function(name) {

                            return name !== CACHE_NAME;

                        })
                        .map(function(name) {

                            return caches.delete(name);

                        })

                );

            })

    );

});