import TabsManager from '../modules/TabsManages';
import ThumbPagination from '../modules/ThumbPagination';

import { store } from '../modules/Store';
import { eventBus } from '../modules/eventBus';
import { formatProductPrice } from '../modules/Product';

import Swiper from 'swiper';
import { EffectFade } from 'swiper/modules';

const url_params = new URLSearchParams(window.location.search);
const product_id = url_params.get('product_id');
const product = store.products.find((product) => product.id == product_id);

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.single-product')) return;

  initProduct();

  initTabs();
  initSliderGallery();
  initQuantityInput();
});

function initProduct() {
  if (!product) return;

  document.querySelector('.single-product__breadcrumbs li:last-child').textContent = product.name;
  document.querySelector('.single-product__title').textContent = product.name;
  document.querySelector('.single-product__price').innerHTML = formatProductPrice(product.price);
  document.querySelector('.single-product__short-description').textContent =
    product.short_description;
  document.querySelector('.single-product-info__description .format-text').textContent =
    product.description;

  document.querySelector('.single-product__rate').style.setProperty('--rate', product.rating.value);
  document.querySelector('.single-product__rated-total').textContent =
    `${product.rating.reviews} Customer Review`;

  document.querySelector('.single-product__add-to-card').addEventListener('click', () => {
    const quantity = +document.querySelector('.quantity input').value;
    eventBus.emit('cart:add', {
      product: product,
      quantity: quantity,
    });
  });

  const favoriteToggle = document.querySelector('.single-product__favorite');
  if (store.favorite.find((item) => item.id === product.id)) {
    favoriteToggle.classList.add('favorite');
  }
  favoriteToggle.addEventListener('click', function () {
    eventBus.emit('favorite:toggle', product);
    this.classList.toggle('favorite');
  });
}
function initTabs() {
  const tabs = document.querySelector('.tabs-container');
  const contents = document.querySelector('.contents-container');

  return new TabsManager(tabs, contents, true);
}
function initSliderGallery() {
  const element = document.querySelector('.single-product__gallery-slider');
  const thumbs = document.querySelector('.single-product__gallery-thumbs');

  const descriptionGallery = document.querySelector('.single-product-info__gallery');

  product.thumbnails.forEach((thumbnail) => {
    const img = `<img src="${thumbnail}" alt="${product.name}">`;

    const thumb = document.createElement('li');
    thumb.innerHTML = img;

    const slide = document.createElement('div');
    slide.classList.add('single-product__gallery-item', 'swiper-slide');
    slide.innerHTML = img;

    thumbs.appendChild(thumb);
    element.querySelector('.swiper-wrapper').appendChild(slide);

    // lower section
    const div = document.createElement('div');
    div.innerHTML = img;
    descriptionGallery.appendChild(div);
  });

  const swiper = new Swiper(element, {
    modules: [EffectFade],
    effect: 'fade',
    loop: true,

    slidesPerView: 2,
  });

  const pagination = new ThumbPagination(thumbs, swiper);
}
function initQuantityInput() {
  document.querySelectorAll('.quantity-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.quantity').querySelector('input');
      const step = btn.dataset.action === 'plus' ? 1 : -1;
      input.value = Math.max(+input.min || 0, +input.value + step);
    });
  });
}
