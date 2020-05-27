/* eslint-disable no-console */

import {register} from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log('~~loaded from a service worker successfully');
        },
        registered() {
            // console.log('Service worker has been registered.');
        },
        cached() {
            // console.log('Content has been cached for offline use.');
        },
        updatefound() {
            // console.log('New content is downloading.');
        },
        updated() {
            // console.log('New content is available; please refresh.');
        },
        offline() {
            console.log('~~running in offline mode');
            // console.log('App is running in offline mode.');
        },
        error(error) {
            console.log(f`~~\n${error}`);
        },
    });
}
