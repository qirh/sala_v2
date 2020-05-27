/* eslint-disable no-console */

import {register} from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log('~~successfully loaded from sw, test 27/5-1631');
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
            console.log('~~new content available, refreshing');
            setTimeout(() => {
                window.location.reload(true);
            });
        },
        offline() {
            console.log('~~running in offline mode');
            // console.log('App is running in offline mode.');
        },
        error(error) {
            console.log(`~~\n${error}`);
        },
    });
}
