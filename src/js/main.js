import '../scss/main.scss';
import './modules/header';

import { registerPageStyles } from './modules/registerPageStyles';
document.addEventListener('DOMContentLoaded', () => registerPageStyles());

import './parts/side-slider';
import './parts/single-product';

import './modules/ProductsManager';
