import {createApp, h} from 'vue';
import App from './App.vue';
import About from './components/About.vue';
import Thirty from './components/Thirty.vue';
import NYCMarathon24 from './components/NYCMarathon24.vue';
import NYCMarathon25 from './components/NYCMarathon25.vue';
import Bday25 from './components/Bday25.vue';

import {createRouter, createWebHistory, RouterView} from 'vue-router';
import store from './store';

import {i18n} from './i18n.js';
import {Translation as I18nT} from 'vue-i18n';
import {installShortcuts} from './shortcuts';
import {installEffects} from './effects';

import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faEnvelope, faFileAlt} from '@fortawesome/free-solid-svg-icons';
import {faSmile} from '@fortawesome/free-regular-svg-icons';
import {
    faGithub,
    faLinkedin,
    faGoodreads,
} from '@fortawesome/free-brands-svg-icons';

library.add(faGithub, faLinkedin, faGoodreads, faEnvelope, faSmile, faFileAlt);

const router = createRouter({
    history: createWebHistory(),
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
        {path: '/nycmarathon24', component: NYCMarathon24},
        {path: '/nycmarathon25', component: NYCMarathon25},
        {path: '/bday25', component: Bday25},
        {path: '/', component: App},
        {path: '/:pathMatch(.*)*', redirect: '/'},
    ],
});

const Root = {render: () => h(RouterView)};

const app = createApp(Root);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('i18n-t', I18nT);
app.use(router);
app.use(store);
app.use(i18n);
installEffects(i18n);
installShortcuts(router);
app.mount('#app');
