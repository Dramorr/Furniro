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

    this.update();
  }
  remove(id) {
    const originalCartSize = store.cart.length;
    store.cart = store.cart.filter((item) => item.product.id !== id);

    this.update();
    return originalCartSize !== store.cart.length;
  }
  update() {
    store.update();
  }
}
