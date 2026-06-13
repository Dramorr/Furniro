import '../scss/main.scss';
import './modules/header';

import { registerPageStyles } from './modules/registerPageStyles';
registerPageStyles().then(() => {
  document.documentElement.classList.remove('styles-loading');
});

import './parts/side-slider';
import './parts/single-product';
import './parts/cart';
import './parts/favorite';

import Cart from './modules/Cart';
import ProductManager from './modules/ProductManager';

const manager = new ProductManager('#products-container');
const cart = new Cart();
