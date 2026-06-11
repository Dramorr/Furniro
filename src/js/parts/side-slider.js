import Swiper from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
  const sideSlider = document.querySelector('.side-slider__slider');
  if (!sideSlider) return;

  const swiper = new Swiper(sideSlider, {
    modules: [Pagination, Navigation],

    loop: true,
    spaceBetween: 24,
    slidesPerView: 'auto',
    loopAdditionalSlides: 2,

    slideToClickedSlide: true,

    pagination: {
      el: '.side-slider__pagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.swiper-button-next',
    },
  });
});
