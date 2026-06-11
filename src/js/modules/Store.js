import products from '../../../products/products.json';

export const store = {
  products: products,
  cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],

  update() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  },
};
