import config from '../config';
import { eventBus } from '../modules/eventBus';
import { formatProductPrice } from '../modules/Product';
import { store } from '../modules/Store';

eventBus.on('favorite:toggle', addToFavorite);
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('section.favorite')) return;

  renderCart();
});
function renderCart() {
  if (!localStorage.getItem('favorite')) return;
  const favorits = JSON.parse(localStorage.getItem('favorite'));
  const tbody = document.querySelector('tbody');

  tbody.innerHTML = '';
  for (const item of favorits) {
    const product = item;
    if (!product) continue;

    const productUrl = `./single-product.html?product_id=${product.id}`;
    const row = document.createElement('tr');
    row.innerHTML = `<td><a href="${productUrl}"><img src="${product.thumbnails[0]}" alt="${product.name}" /></a></td>
      <td><a href="${productUrl}">${product.name}</a></td>
      <td>${formatProductPrice(product.price, 'favorite-single-price')}</td>
      <td><button class="add-to-card btn">Add to Cart</button></td>
    `;

    row.querySelector('button.add-to-card').addEventListener('click', () => {
      eventBus.emit('cart:add', { product: product });
    });

    tbody.appendChild(row);
  }
}
function addToFavorite(product) {
  if (!product) return false;

  const isFavorite = store.favorite.find((item) => item.id === product.id);
  if (isFavorite) store.favorite = store.favorite.filter((item) => item.id !== product.id);
  else store.favorite.push(product);

  store.updateFavorite();
  return true;
}
