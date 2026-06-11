import '../scss/main.scss';
import './modules/header';

import { registerPageStyles } from './modules/registerPageStyles';
document.addEventListener('DOMContentLoaded', () => registerPageStyles());

import './parts/side-slider';
import './parts/single-product';

import Cart from './modules/Cart';
import ProductManager from './modules/ProductManager';

const manager = new ProductManager('#products-container');
const cart = new Cart();

// manager.renderOn(document.querySelector('#products-container'));
