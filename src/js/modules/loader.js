function waitPageToLoad() {
  return new Promise((resolve) => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

    if (!links.length) return resolve();

    let loaded = 0;
    const onLoad = () => {
      if (++loaded >= links.length) requestAnimationFrame(() => requestAnimationFrame(resolve));
    };

    links.forEach((link) => {
      if (link.sheet) {
        onLoad();
      } else {
        link.addEventListener('load', onLoad, { once: true });
        link.addEventListener('error', onLoad, { once: true }); // не блокуємо якщо стиль не завантажився
      }
    });
  });
}

function loader() {
  const loaderEl = document.querySelector('#loader');
  waitPageToLoad().then(() => {
    if (!loaderEl) return;

    loaderEl.classList.add('loaded');
  });
}
loader();
