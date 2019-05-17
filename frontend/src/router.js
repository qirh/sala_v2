import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Blog from '@/views/Blog';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { title: 'home' },
        },
        {
            path: '/blog',
            name: 'blog',
            component: Blog,
        },
        {
            path: '*',
            redirect: '/'
          },
    ],
});
