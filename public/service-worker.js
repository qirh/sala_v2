workbox.core.setCacheNameDetails({prefix: 'sala'});
const LATEST_VERSION = '0.3';

self.addEventListener('activate', (event) => {
    console.log(`%c ${LATEST_VERSION} `);
    if (caches) {
        caches.keys().then((arr) => {
            arr.forEach((key) => {
                if (key.indexOf('sala-precache') < -1) {
                    caches
                        .delete(key)
                        .then(() => console.log(`%c Cleared ${key}`));
                } else {
                    caches.open(key).then((cache) => {
                        cache.match('version').then((res) => {
                            if (!res) {
                                cache.put(
                                    'version',
                                    new Response(LATEST_VERSION, {
                                        status: 200,
                                        statusText: LATEST_VERSION,
                                    }),
                                );
                            } else if (res.statusText !== LATEST_VERSION) {
                                caches
                                    .delete(key)
                                    .then(() =>
                                        console.log(
                                            `%c Cleared Cache ${LATEST_VERSION}`,
                                        ),
                                    );
                            } else
                                console.log(
                                    `%c Great you have the latest version ${LATEST_VERSION}`,
                                );
                        });
                    });
                }
            });
        });
    }
});

workbox.skipWaiting();
workbox.clientsClaim();

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
