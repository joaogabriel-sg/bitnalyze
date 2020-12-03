import MenuMobile from './modules/menu-mobile.js';
import ScrollAnimation from './modules/scroll-animation.js';
import AccordionList from './modules/accordion-list.js';
import SmoothScroll from './modules/smooth-scroll.js';
import BitcoinDatas from './modules/fetch-btc.js';

const menuMobile = new MenuMobile('.header__mobile-burger');
menuMobile.init();

const scrollAnimation = new ScrollAnimation('[data-anime="scroll"]');
scrollAnimation.init();

const accordionList = new AccordionList('[data-question]', '[data-answer]', 'open');
accordionList.init();

const smoothScroll = new SmoothScroll('a[href^="#"]');
smoothScroll.init();

const bitcoinDatas = new BitcoinDatas({
  now: '.price__btc-now span',
  forHundred: '.price__btc-hundred span',
});
bitcoinDatas.init();
