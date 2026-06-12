import config from '../productsConfig';
import { eventBus } from '../modules/eventBus';
import { formatProductPrice } from '../modules/Product';

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});
function renderCart() {
  if (!localStorage.getItem('cart')) return;
  const cart = JSON.parse(localStorage.getItem('cart'));
  const tbody = document.querySelector('tbody');
  let totalPrice = 0;

  tbody.innerHTML = '';
  for (const item of cart) {
    const { product, quantity } = { ...item };
    if (!product) continue;

    const productUrl = `./single-product.html?product_id=${product.id}`;
    const productTotalPrice =
      (product.price.discount
        ? product.price.original - (product.price.original / 100) * product.price.discount
        : product.price.original) * quantity;
    totalPrice += productTotalPrice;

    const row = document.createElement('tr');
    row.innerHTML = `<td><a href="${productUrl}"><img src="${product.thumbnails[0]}" alt="${product.name}" /></a></td>
      <td><a href="${productUrl}">${product.name}</a></td>
      <td>${formatProductPrice(product.price, 'cart-single-price')}</td>
      <td><span class="cart__quantity">${quantity}</span></td>
      <td>${formatProductPrice({ original: productTotalPrice }, 'cart-total-price')}</td>
      <td><button class="remove-from-cart" style="--icon: url(${config.domain}/svg/trash-bin.svg)"></button></td>
    `;
    row.querySelector('.remove-from-cart').addEventListener('click', () => {
      eventBus.emit('cart:remove', product.id);
      row.remove();
      renderCart();
    });

    tbody.appendChild(row);
  }

  document.querySelector('.cart__checkout-row-value').textContent = formatProductPrice({
    original: totalPrice,
  });
}
