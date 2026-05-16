import {addMessages, init, locale} from 'svelte-i18n';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

addMessages('en', en);
addMessages('ar', ar);

init({
    fallbackLocale: 'en',
    initialLocale: 'en',
});

export {locale};
