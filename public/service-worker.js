//https://medium.com/js-dojo/vuejs-pwa-cache-busting-8d09edd22a31
workbox.core.setCacheNameDetails({prefix: '~~saleh~~'});
const LATEST_VERSION = '1.1';

self.addEventListener('activate', () => {
    if (caches) {
        caches.keys().then((arr) => {
            arr.forEach((key) => {
                if (key.indexOf('~~saleh~~-precache') < -1) {
                    caches.delete(key);
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
                                caches.delete(key);
                            }
                        });
                    });
                }
            });
        });
    }
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
