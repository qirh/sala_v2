import App from './App.vue';
import About from './components/About.vue';
import Thirty from './components/Thirty.vue';

import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

import VueMousetrap from 'vue-mousetrap';

import {i18n} from './i18n.js';

import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
    faBlog,
    faEnvelope,
    faFistRaised,
    faMountain,
    faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
    faQuestionCircle,
    faSmile,
    faSmileWink,
} from '@fortawesome/free-regular-svg-icons';
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
    faFistRaised,
    faMountain,
    faSmileWink,
    faFileAlt,
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
                    'https://drive.google.com/file/d/1pGKRrs6UCesvZulALOYSpMilfb0njTHL/view?usp=sharing';
            },
        },
        {
            path: '/resume',
            beforeEnter() {
                window.location =
                    'https://drive.google.com/file/d/1pGKRrs6UCesvZulALOYSpMilfb0njTHL/view?usp=sharing';
            },
        },
        {path: '/about', component: About},
        {path: '/30', component: Thirty},
        {path: '/', component: App},
        {path: '*', redirect: '/'},
    ],
});

new Vue({
    router,
    store,
    i18n,
}).$mount('#app');
