const HEADER_FIXATION_POINT = 100;
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const burger = header.querySelector('.header__burger');
  const navigation = header.querySelector('nav.header__nav');
  if (!burger || !navigation) return;

  burger.addEventListener('click', (e) => {
    burger.classList.toggle('clicked');
    navigation.classList.toggle('open');
  });

  window.addEventListener('scroll', function () {
    const IS_FIXED = header.classList.contains('fixed');
    if (this.window.scrollY >= HEADER_FIXATION_POINT) {
      if (!IS_FIXED) {
        header.classList.add('fixed');
        header.classList.remove('default');
      }
    } else {
      if (IS_FIXED) {
        header.classList.add('unfixing');
        header.addEventListener(
          'animationend',
          (e) => {
            header.classList.remove('unfixing');
            header.classList.remove('fixed');
            header.classList.add('default');
          },
          { once: true }
        );
      }
    }
  });
});

// window.addEventListener('click', function (e) {
//   const headerLink = e.target.closest('.header__list a, .btn');
//   if (!headerLink) return;

//   headerNav?.classList.remove('open');
//   burgerBtn?.classList.remove('clicked');
// });
