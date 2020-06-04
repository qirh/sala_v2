# sala_v2
![Build](https://github.com/qirh/sala_v2/workflows/Build/badge.svg)  [![Netlify Status](https://api.netlify.com/api/v1/badges/29595778-1307-4507-8c47-2d05b733ee43/deploy-status)](https://app.netlify.com/sites/musing-rosalind-eedabd/deploys)

personal website v2. il y en a beaucoup comme ça, mais lui, c'est le mien.

work in progress. [saleh.sh](https://saleh.sh) currently redirects to the old website ([saleh.alghusson.com](https://saleh.alghusson.com)).

### caveats
* there's 2 places to update `versions` very un-dry.
    1. `store.js` to store the state. Changing the version here will init a new state with default values.
    2. `service-worker.js` new version deployed. Changing the version here will cause the app to refresh the page and load the new version.

## credit
* [fort awesome](https://fortawesome.com)
* [vi18n](https://github.com/kazupon/vue-i18n)
* [theme change button](https://codepen.io/moso/pen/MxLwbE)
* [theme transition](https://medium.com/@mwichary/dark-theme-in-a-day-3518dde2955a) & [another source](https://codepen.io/jaredpdesigns/pen/dXkBJZ)
* [language transition](https://codepen.io/rayjackson/pen/VJRPdP)
* [favicon generator](https://ionos.com/tools/favicon-generator)
* [ASCII Art](http://patorjk.com/software/taag/)

### fonts
* [national park](https://nationalparktypeface.com)
* [classic fonts](https://int10h.org/oldschool-pc-fonts)
* [arabic fonts](https://arabicfonts.net)
* [alif-type](https://github.com/alif-type)


licensed with [WTFPL](http://www.wtfpl.net).
