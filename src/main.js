import App from './App.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

import VueMousetrap from 'vue-mousetrap';
import './registerServiceWorker';

import {i18n} from './i18n.js';

import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faBlog, faEnvelope} from '@fortawesome/free-solid-svg-icons';
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
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(VueMousetrap);
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: '/cv',
            beforeEnter() {
                window.location =
                    'https://drive.google.com/file/d/1qwZzVOZ4PbAedrvirdGsIDDWAoAwFOoJ/view?usp=sharing';
            },
        },
        {
            path: '/resume',
            beforeEnter() {
                window.location =
                    'https://drive.google.com/file/d/1qwZzVOZ4PbAedrvirdGsIDDWAoAwFOoJ/view?usp=sharing';
            },
        },
        {path: '/', component: App},
        {path: '*', redirect: '/'},
    ],
});

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
