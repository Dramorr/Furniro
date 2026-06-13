import { store } from './Store';
import { Product } from './Product';

export default class ProductManager {
  page = 0;

  constructor(container, settings = {}) {
    if (!container) return;

    this.container = document.querySelector(container);
    if (!this.container) return;

    this.settings = {
      products_per_page: this.container.dataset.productsPerPage ?? 4,
      has_load_more_btn: this.container.hasAttribute('data-load-more'),
      has_pagination: this.container.hasAttribute('data-pagination'),
      ...settings,
    };

    this.setCurrentProducts(store.products.map((product) => new Product(product)));

    if (this.settings.has_load_more_btn) {
      this.container.parentElement.appendChild(this.createLoadMoreBtn());
    }
    if (this.settings.has_pagination) {
      this.container.parentElement.appendChild(this.createPagination());
    }

    this.setPage(0, true);
  }

  setCurrentProducts(products) {
    if (!products) return false;

    this.products = products;
    this.max_pages = Math.ceil(this.products.length / this.settings.products_per_page);
  }
  // setFilter(filter) {}

  loadMore(products = this.products) {
    const startAt = (this.page + 1) * this.settings.products_per_page;
    const endAt = startAt + +this.settings.products_per_page;
    for (let i = startAt; i < endAt; ++i) {
      if (!products[i]) break;

      this.container.appendChild(products[i].createCard());
    }

    if (this.loadMoreBtn && this.page + 1 >= this.max_pages - 1) {
      this.loadMoreBtn.style.display = 'none';
    }

    ++this.page;
  }
  setPage(page = 0, init = false) {
    if (page < 0) return;
    if (page > this.max_pages - 1) return;
    if (!init && page === this.page) return;

    this.container.innerHTML = '';

    const startAt = page * this.settings.products_per_page;
    const endAt = startAt + +this.settings.products_per_page;

    for (let i = startAt; i < endAt; ++i) {
      this.container.appendChild(this.products[i].createCard());
    }

    this.page = page;
    if (this.pagination) {
      this.pagination.querySelector('.active')?.classList.remove('active');
      this.pagination.querySelector(`[data-page-index="${this.page}"]`).classList.add('active');
    }
  }

  createLoadMoreBtn() {
    this.loadMoreBtn = document.createElement('button');
    this.loadMoreBtn.classList.add('btn', `${this.container.classList[0].split('__')[0]}__btn`);
    this.loadMoreBtn.setAttribute('aria-label', 'load-more');
    this.loadMoreBtn.textContent = 'Show More';

    this.loadMoreBtn.addEventListener('click', () => {
      this.loadMore();
    });

    return this.loadMoreBtn;
  }
  createPagination() {
    this.pagination = document.createElement('div');
    this.pagination.classList.add('pagination');

    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');
    prevBtn.classList.add('btn', 'pagination-btn', 'pagination-prev-btn');
    nextBtn.classList.add('btn', 'pagination-btn', 'pagination-next-btn');

    this.pagination.appendChild(prevBtn);
    for (let i = 0; i < this.max_pages; ++i) {
      const pageBtn = document.createElement('button');
      pageBtn.classList.add('btn', 'pagination-btn', 'pagination-page-btn');
      pageBtn.dataset.pageIndex = i;
      pageBtn.textContent = i + 1;

      this.pagination.appendChild(pageBtn);
    }
    this.pagination.appendChild(nextBtn);

    this.pagination.addEventListener('click', (e) => {
      const btn = e.target.closest('.pagination-btn');
      if (!btn) return;
      if (btn.classList.contains('active')) return;

      if (btn.classList.contains('pagination-prev-btn')) {
        this.setPage(this.page - 1);
        return;
      }
      if (btn.classList.contains('pagination-next-btn')) {
        this.setPage(this.page + 1);
        return;
      }

      this.setPage(+btn.dataset.pageIndex);
    });

    return this.pagination;
  }

  // render(container) {}
  static getAllProductc() {
    return this.products;
  }
}
