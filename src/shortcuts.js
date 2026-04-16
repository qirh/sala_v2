import Mousetrap from 'mousetrap';
import store from './store';
import {getNextLang} from './consts';

const CV_URL =
    'https://drive.google.com/file/d/1pGKRrs6UCesvZulALOYSpMilfb0njTHL/view?usp=sharing';

const NON_ANIMATED_KEYS = [
    'Tab',
    'CapsLock',
    'Shift',
    'Control',
    'Alt',
    'Meta',
    ' ',
    'Backspace',
    'Enter',
];

function flip() {
    const cuerpo = document.getElementById('cuerpo');
    if (!cuerpo) return false;
    if (store.state.flipDirection) {
        cuerpo.classList.add('flip-right');
    } else {
        cuerpo.classList.add('flip-left');
    }
    setTimeout(() => {
        cuerpo.classList.remove('flip-right');
        cuerpo.classList.remove('flip-left');
        store.commit('switchFlipDirection');
    }, 750);
    return false;
}

function handleKeyDown(event) {
    const cuerpo = document.getElementById('cuerpo');
    if (!NON_ANIMATED_KEYS.includes(event.key)) {
        if (cuerpo) {
            cuerpo.classList.add('keydown');
            cuerpo.classList.add(`_${event.key}`);
        }
        return;
    }
    if (event.key === ' ') {
        event.preventDefault();
    }
}

function handleKeyUp(event) {
    if (event.key === ' ' && store.state.currentLang) {
        const nextLang = getNextLang(store.state.currentLang.code);
        store.commit('changeLang', nextLang);
    }
    const cuerpo = document.getElementById('cuerpo');
    if (cuerpo) {
        cuerpo.classList.remove('keydown');
        cuerpo.classList.remove(`_${event.key}`);
    }
}

function firstHelpMessage() {
    // eslint-disable-next-line
    console.log(
        '%chello there! the website reacts to ' + '%chelp',
        'background: #222; color: #bada55',
        'color: #1569cf',
    );
}

function secondHelpMessage() {
    // eslint-disable-next-line
    console.log(
        '%calso~~ ' +
            '%ckonami code' +
            '%c || ' +
            '%ct' +
            '%c || ' +
            '%cf' +
            '%c || ' +
            '%cspace bar',
        'background: #222; color: #bada55',
        'color: #831376',
        'background: #222; color: #bada55',
        'color: #88e49a',
        'background: #222; color: #bada55',
        'color: #e02988',
        'background: #222; color: #bada55',
        'color: #2ab30f',
    );
}

export function installShortcuts(router) {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    Mousetrap.bind(
        ['h e l p', 'م س ا ع د ه', 'م س ا ع د ة'],
        secondHelpMessage,
    );
    Mousetrap.bind(['c v', 'r e s u m e', 'س ي ر ه', 'س ي ر ة'], () => {
        window.location = CV_URL;
    });
    Mousetrap.bind(['a b o u t'], () => router.push('/about'));
    Mousetrap.bind(['3 0', 't h i r t y'], () => router.push('/30'));
    Mousetrap.bind(['2 5', 'm a r a t h o n'], () =>
        router.push('/nycmarathon25'),
    );
    Mousetrap.bind(['f', 'خ'], () => store.commit('toggleFont'));
    Mousetrap.bind(['t', 'ل'], () => store.commit('toggleTheme'));
    Mousetrap.bind(
        [
            'up up down down left right left right b a',
            'i d d q d',
            'up up down down left right left right ز ش',
        ],
        flip,
    );

    firstHelpMessage();
}
