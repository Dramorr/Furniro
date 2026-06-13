import { eventBus } from './eventBus';
import { store } from './Store';

export default class Cart {
  products = [];

  constructor() {
    eventBus.on('cart:add', ({ product, quantity = 1 }) => this.add(product, quantity));
    eventBus.on('cart:remove', (id) => this.remove(id));
  }

  add(product, quantity) {
    const existingProduct = store.cart.find((item) => item.product.id === product.id);
    if (existingProduct) existingProduct.quantity += quantity;
    else {
      store.cart.push({
        product: product,
        quantity: quantity,
      });
    }

    this.messageSuccess();
    this.update();
  }
  remove(id) {
    const originalCartSize = store.cart.length;
    store.cart = store.cart.filter((item) => item.product.id !== id);

    this.update();
    return originalCartSize !== store.cart.length;
  }
  update() {
    store.updateCart();
  }

  messageSuccess(text = 'Added to cart') {
    const message = document.createElement('div');
    message.classList.add('message', 'add-to-cart__success');
    message.textContent = text;

    document.documentElement.appendChild(message);
    setTimeout(() => {
      message.style.animation = 'none';
      message.offsetHeight; // ← примусовий reflow
      message.style.animation = 'message-popup .3s ease 0s 1 reverse forwards';
      message.addEventListener('animationend', () => message.remove(), { once: true });
    }, 2000);
  }
}
