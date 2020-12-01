import MenuMobile from './modules/menu-mobile.js';
import ScrollAnimation from './modules/scroll-animation.js';

const menuMobile = new MenuMobile('.header__mobile-burger');
menuMobile.init();

const scrollAnimation = new ScrollAnimation('[data-anime="scroll"]');
scrollAnimation.init();
