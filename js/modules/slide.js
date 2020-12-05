export default class Slide {
  constructor(slide, slideWrapper) {
    this.slide = document.querySelector(slide);
    this.slideWrapper = document.querySelector(slideWrapper);
    this.distance = { initial: 0, final: 0, movement: 0 };
  }

  activeMovementToSlide(position) {
    let pos = position;
    if (pos >= 300 || pos <= -1650) pos = 0;
    this.slide.style.transform = `translate3d(${pos}px, 0, 0)`;
    this.distance.movePosition = pos;
  }

  updatePosition(clientX) {
    this.distance.movement = (this.distance.initial - clientX) * 1.25;
    return this.distance.final - this.distance.movement;
  }

  moveSlideEvent(e) {
    const pointerPosition = e.type === 'mousemove' ? e.clientX : e.targetTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.activeMovementToSlide(finalPosition);
  }

  finishSlideEvent(e) {
    const movetype = e.type === 'mouseup' ? 'mousemove' : 'touchmove';
    this.slideWrapper.removeEventListener(movetype, this.moveSlideEvent);
    this.distance.final = this.distance.movePosition;
  }

  startSlideEvent(e) {
    let movetype;
    if (e.type === 'mousedown') {
      e.preventDefault();
      this.distance.initial = e.clientX;
      movetype = 'mousemove';
      this.device = 'desktop';
    } else {
      this.distance.initial = e.targetTouches[0].clientX;
      movetype = 'touchmove';
      this.device = 'mobile';
    }

    this.slideWrapper.addEventListener(movetype, this.moveSlideEvent);
  }

  addEventsForSlide() {
    this.slideWrapper.addEventListener('mousedown', this.startSlideEvent);
    this.slideWrapper.addEventListener('touchstart', this.startSlideEvent);
    this.slideWrapper.addEventListener('mouseup', this.finishSlideEvent);
    this.slideWrapper.addEventListener('touchend', this.finishSlideEvent);
  }

  bindEvents() {
    this.startSlideEvent = this.startSlideEvent.bind(this);
    this.finishSlideEvent = this.finishSlideEvent.bind(this);
    this.moveSlideEvent = this.moveSlideEvent.bind(this);
  }

  init() {
    if (this.slide && this.slideWrapper) {
      this.bindEvents();
      this.addEventsForSlide();
    }
    return this;
  }
}
