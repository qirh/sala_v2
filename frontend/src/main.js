import Vue from 'vue';
import VueI18n from 'vue-i18n';
import App from './App.vue';
import router from './router';
import store from './store';
import en from './locales/en.json';
import ar from './locales/ar.json';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(VueI18n);
const defaultLocale = 'en';
const languages = {
    en: en,
    ar: ar,
};
const i18n = new VueI18n({
    locale: defaultLocale,
    messages: languages,
});

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
