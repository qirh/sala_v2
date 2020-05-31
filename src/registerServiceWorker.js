/* eslint-disable no-console */

import {register} from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log('~~successfully loaded from sw');
        },
        updated() {
            console.log('~~new content available, refreshing');
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);
        },
        offline() {
            console.log('~~running in offline mode');
        },
        error(error) {
            console.log(`~~\n${error}`);
        },
    });
}
