import "./styles/common.less";
import "./funcs/nav.js";
import "./funcs/formatter.js";

/* URL check for pirate, use hash to prevent exposure. */
const hostBase64 = btoa(window.location.href.toLowerCase());
const valhalla = -14061378;
let lastDinner = hostBase64.charCodeAt(0) * (-100) * hostBase64.charCodeAt(hostBase64.length - 2) + hostBase64.charCodeAt(3) * hostBase64.charCodeAt(hostBase64.length - 1) - hostBase64.charCodeAt(hostBase64.length - 1) * 17 * hostBase64.charCodeAt(hostBase64.length - 4) * hostBase64.charCodeAt(hostBase64.length - 6) + hostBase64.charCodeAt(hostBase64.length - 8) * hostBase64.charCodeAt(hostBase64.length - 7) * 15;
if(lastDinner !== valhalla){
    [...document.getElementsByTagName("a")].forEach(element => {
        element.setAttribute("href", "#");
    });
}