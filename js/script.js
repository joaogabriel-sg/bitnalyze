import MenuMobile from './modules/menu-mobile.js';
import ScrollAnimation from './modules/scroll-animation.js';
import AccordionList from './modules/accordion-list.js';
import SmoothScroll from './modules/smooth-scroll.js';
import BitcoinDatas from './modules/fetch-btc.js';
import Slide from './modules/slide.js';

const menuMobile = new MenuMobile('.header__mobile-burger');
menuMobile.init();

const scrollAnimation = new ScrollAnimation('[data-anime="scroll"]');
scrollAnimation.init();

const accordionList = new AccordionList('[data-question]', '[data-answer]', 'open');
accordionList.init();

const smoothScroll = new SmoothScroll('a[href^="#"]');
smoothScroll.init();

const bitcoinDatas = new BitcoinDatas({
  priceNowDiv: '.price__btc-now span',
  hundredDiv: '.price__btc-hundred span',
  countdownDetails: {
    countdownNumber: '.countdown__number',
    countdownCircle: '.price__btc-countdown svg circle',
  },
  variationDetails: {
    variationDiv: '.price__btc-variation span',
    positiveClass: 'v-positive',
    negativeClass: 'v-negative',
  },
  graph: 'canvas#myChart',
  dataQuantity: 5,
  changeDetails: {
    changeRange: '.change__container input[type="range"]',
    changePriceBRL: '.change__price-brl',
    changePriceBTC: '.change__result-btc span',
  },
});
bitcoinDatas.init();

const slide = new Slide('.slide', '.slide__wrapper');
slide.init();
