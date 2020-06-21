/* eslint-disable no-console */

import {register} from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        updated() {
            console.log('New content is available; please refresh.');
        },
        offline() {
            console.log(
                'No internet connection found. App is running in offline mode.',
            );
        },
    });
}
