// src/js/registerPageStyles.js

// Vite: збирає ВСІ scss файли як потенційні чанки, але не тягне їх одразу
const sectionStyles = import.meta.glob('../../scss/layouts/*.scss');

function fileNameFromPath(path) {
  // '../scss/sections/contact-us.scss' -> 'contact-us'
  return path.split('/').pop().replace('.scss', '');
}

const stylesByName = Object.fromEntries(
  Object.entries(sectionStyles).map(([path, loader]) => [fileNameFromPath(path), loader])
);

export async function registerPageStyles(root = document) {
  const sections = root.querySelectorAll('main > section, section.tabs section');
  if (!sections.length) return;

  // збираємо унікальні назви секцій, які реально є на сторінці
  const present = new Set();
  sections.forEach((section) => {
    section.classList.forEach((cls) => present.add(cls));
  });

  // підвантажуємо тільки ті scss, що існують у папці sections
  const imports = [];
  present.forEach((name) => {
    const load = stylesByName[name];
    if (load) imports.push(load());
  });

  await Promise.all(imports);
}
