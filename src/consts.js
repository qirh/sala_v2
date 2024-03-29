const langs = [
    {
        code: 'en',
        name: 'English',
        direction: 'ltr',
        title: 'Saleh Alghusson',
        fonts: ['font-rubik', 'font-ibm'],
    },
    {
        code: 'ar',
        name: 'عربي',
        direction: 'rtl',
        title: 'صالح الغصون',
        fonts: ['font-amiri', 'font-aref-ruqaa'],
    },
];

const defaultLangCode = 'en';

function mod(n, m) {
    return ((n % m) + m) % m;
}

function getLangObjectFromCode(langCode) {
    const langObject = langs.find((lang) => lang.code === langCode);
    if (langObject) {
        return langObject;
    }
    return getLangObjectFromCode(defaultLangCode);
}

function getNextLang(langCode) {
    const langObjectFromList = (lang) => lang.code === langCode;
    const index = langs.findIndex(langObjectFromList);
    return langs[mod(index + 1, langs.length)];
}
function getPrevLang(langCode) {
    const langObjectFromList = (lang) => lang.code === langCode;
    const index = langs.findIndex(langObjectFromList);
    return langs[mod(index - 1, langs.length)];
}

export {langs, mod, getLangObjectFromCode, getNextLang, getPrevLang};
