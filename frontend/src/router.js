import Vue from 'vue';
import Router from 'vue-router';

import Books from '@/views/Books';
import Home from '@/views/Home';
import Projects from '@/views/Projects';
import Reading from '@/views/Reading';
import Writing from '@/views/Writing';

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
            path: '/r',
            component: Reading,
            meta: {title: 'reading'},
        },
        {
            path: '/w',
            component: Writing,
            meta: {title: 'writing'},
        },
        {
            path: '*',
            redirect: '/',
        },
    ],
});
