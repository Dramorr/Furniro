import config from '../productsConfig';
import { eventBus } from './eventBus';

export class Product {
  static cardClass = 'product-card';

  constructor(object) {
    if (!object) return;

    this.id = object.id;
    this.name = object.name;
    this.price = object.price;
    this.badge = object.badge;
    this.thumbnails = object.thumbnails;
    this.description = object.description;
    this.short_description = object.short_description;
  }

  createCard() {
    const card = document.createElement('card');
    card.className = Product.cardClass;

    let badgeHTML = '';
    if (this.badge) {
      badgeHTML = `
        <span class="${Product.cardClass}__badge ${Product.cardClass}__badge--${this.badge}">
          ${this.badge === 'new' ? 'New' : `-${this.price.discount}%`}
        </span>
      `;
    }

    card.innerHTML = `<a class="${Product.cardClass}__front" href="./single-product.html?product_id=${this.id}">
      <div class="${Product.cardClass}__thumb">
        <img src="${this.thumbnails[0]}" alt="product-img">
      </div>
      <div class="${Product.cardClass}__info">
        <h3 class="${Product.cardClass}__title">${this.name}</h3>
        <p class="${Product.cardClass}__description">${this.card_description}</p>
        <div class="${Product.cardClass}__price">${formatProductPrice(this.price)}</div>
      </div>
    </a>
    
    ${badgeHTML}

    <div class="${Product.cardClass}__overlay">
      <button class="${Product.cardClass}__btn btn" href="#">Add to cart</button>
      <div class="${Product.cardClass}__instruments">
        <a class="${Product.cardClass}__share" href="#">Share</a>
        <a class="${Product.cardClass}__compare" href="#">Compare</a>
        <button class="${Product.cardClass}__like" href="#">Like</button>
      </div>
    </div>`;

    card.querySelector(`.${Product.cardClass}__btn`)?.addEventListener('click', () => {
      eventBus.emit('cart:add', { product: this });
    });

    return card;
  }
}
export function formatProductPrice({ original, discount }) {
  if (discount) {
    return `
      <span class="product-card__price-discount">
        ${config.currency.symbol} ${Math.round(original - (original / 100) * discount).toLocaleString(config.currency.locale)}
      </span>
      <span class="product-card__price-original">
      ${config.currency.symbol} ${original.toLocaleString(config.currency.locale)}
      </span>
    `;
  }

  return `${config.currency.symbol} ${original.toLocaleString(config.currency.locale)}`;
}
