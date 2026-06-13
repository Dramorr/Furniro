import products from '../../../products/products.json';

export const store = {
  products: products,
  cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
  favorite: localStorage.getItem('favorite') ? JSON.parse(localStorage.getItem('favorite')) : [],

  update() {
    this.updateCart();
    this.updateFavorite();
  },
  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  },
  updateFavorite() {
    localStorage.setItem('favorite', JSON.stringify(this.favorite));
  },
};
// localStorage.clear();
