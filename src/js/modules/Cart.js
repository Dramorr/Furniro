import { eventBus } from './eventBus';
import { store } from './Store';

export default class Cart {
  products = [];

  constructor() {
    eventBus.on('cart:add', ({ product, quantity = 1 }) => this.add(product, quantity));
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

    console.log(store.cart);
  }
}
