import Vue from 'vue';
import Router from 'vue-router';

import Books from '@/views/Books';
import Home from '@/views/Home';
import Projects from '@/views/Projects';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Home,
            meta: {title: 'home'},
        },
        {
            path: '/b',
            component: Books,
            meta: {title: 'books'},
        },
        {
            path: '/p',
            component: Projects,
            meta: {title: 'projects'},
        },
        {
            path: '*',
            redirect: '/',
        },
    ],
});
