import TradeMobile from '../trade/TradeMobile';
import WebCard from '../web/WebCard';
import { requireAuthOnEnter } from '../_data/Auth';

const isMobile = /Mobile/.test(window.navigator.userAgent);

const rootComponent = isMobile ? TradeMobile : WebCard;

export default [
    { path: '/', component: rootComponent, onEnter: requireAuthOnEnter },
    { path: '*', component: rootComponent, onEnter: requireAuthOnEnter },
];
