import MenuMobile from './modules/menu-mobile.js';
import ScrollAnimation from './modules/scroll-animation.js';
import AccordionList from './modules/accordion-list.js';

const menuMobile = new MenuMobile('.header__mobile-burger');
menuMobile.init();

const scrollAnimation = new ScrollAnimation('[data-anime="scroll"]');
scrollAnimation.init();

const accordionList = new AccordionList('[data-question]', '[data-answer]', 'open');
accordionList.init();
