const langs = [
    {
        code: 'en',
        name: 'English',
        placement: 'left',
        direction: 'ltr',
        title: 'sala',
        fonts: ['font-rubik', 'font-nps-heavy', 'font-ibm'],
    },
    {
        code: 'es',
        name: 'Español',
        placement: 'left',
        direction: 'ltr',
        title: 'sàla',
        fonts: ['font-rubik', 'font-nps-heavy', 'font-ibm'],
    },
    {
        code: 'ar',
        name: 'عربي',
        placement: 'right',
        direction: 'rtl',
        title: 'صاله',
        fonts: ['font-amiri', 'font-kfgqpc', 'font-geeza'],
    },
];

const defaultLangCode = 'en';

function mod(n, m) {
    return ((n % m) + m) % m;
}

export {langs, defaultLangCode, mod};
