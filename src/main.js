import App from './App.vue';
import Vue from 'vue';
import store from './store';

import VTooltip from 'v-tooltip';
import './registerServiceWorker';

import {i18n} from './i18n.js';

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faBlog, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import {
    faVuejs,
    faGithub,
    faGoodreads,
} from '@fortawesome/free-brands-svg-icons';

library.add(
    faVuejs,
    faGithub,
    faGoodreads,
    faEnvelope,
    faBlog,
    faQuestionCircle,
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(VTooltip);

new Vue({
    store,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
