import App from './App.vue';
import Vue from 'vue';
import store from './store';

import VueMousetrap from 'vue-mousetrap';
import LogRocket from 'logrocket';
import './registerServiceWorker';

import {i18n} from './i18n.js';

import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
    faBlog,
    faEnvelope,
    faMountain,
} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle, faSmile} from '@fortawesome/free-regular-svg-icons';
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
    faSmile,
    faMountain,
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;
LogRocket.init('hrwrkh/sala');

Vue.use(VueMousetrap);
Vue.use(LogRocket);

new Vue({
    store,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
