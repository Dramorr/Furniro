export default class ThumbPagination {
  constructor(element, slider) {
    if (!element) return;

    this.el = element;
    this.slider = slider;

    this.el.addEventListener('click', this.onClick.bind(this));
    this.slider.on('slideChange', this.onSlideChnage.bind(this));

    this.el.children[0].classList.add('active');
  }

  onClick(e) {
    const item = e.target.closest('li');
    if (!item) return;

    const newSlideIndex = [...this.el.children].indexOf(item);
    this.slider.slideTo(newSlideIndex);
    return newSlideIndex;
  }
  onSlideChnage() {
    this.el.querySelector('.active')?.classList.remove('active');
    this.el.children[this.slider.realIndex].classList.add('active');
  }
}
