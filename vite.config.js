import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';
import fg from 'fast-glob';
import sharp from 'sharp';
import fs from 'fs';

// ---------- Sharp optimizer (post-build) ----------
function sharpImageminPlugin(options = {}) {
  const {
    inputDir = 'assets/img/', // ✅ was assets/images
    include = ['**/*.{png,jpg,jpeg,webp,avif}'],
    makeWebp = true,
    webpQuality = 75,
    jpegQuality = 75,
    pngCompressionLevel = 9,
    avifQuality = 60,
  } = options;

  return {
    name: 'sharp-imagemin',
    apply: 'build',
    async closeBundle() {
      const distRoot = path.resolve(__dirname, 'dist');
      const patterns = include.map((p) => path.posix.join(inputDir.replace(/\\/g, '/'), p));

      const files = await fg(patterns, { cwd: distRoot, onlyFiles: true });
      if (!files.length) return;

      await Promise.all(
        files.map(async (rel) => {
          const abs = path.join(distRoot, rel);
          const ext = path.extname(abs).toLowerCase();
          const base = abs.slice(0, -ext.length);

          try {
            const img = sharp(abs, { failOn: 'none' });

            if (ext === '.jpg' || ext === '.jpeg') {
              await img.jpeg({ quality: jpegQuality, mozjpeg: true }).toFile(abs + '.tmp');
              await fs.renameSync(abs + '.tmp', abs);
            } else if (ext === '.png') {
              await img.png({ compressionLevel: pngCompressionLevel }).toFile(abs + '.tmp');
              await fs.renameSync(abs + '.tmp', abs);
            } else if (ext === '.webp') {
              await img.webp({ quality: webpQuality }).toFile(abs + '.tmp');
              await fs.renameSync(abs + '.tmp', abs);
            } else if (ext === '.avif') {
              await img.avif({ quality: avifQuality }).toFile(abs + '.tmp');
              await fs.renameSync(abs + '.tmp', abs);
            }

            if (makeWebp && ['.png', '.jpg', '.jpeg'].includes(ext)) {
              await sharp(abs, { failOn: 'none' })
                .webp({ quality: webpQuality })
                .toFile(`${base}.webp`);
            }
          } catch (e) {
            console.warn('[sharp-imagemin] skip:', rel, e?.message || e);
          }
        })
      );
    },
  };
}

//
function getLayoutEntries(lookIn) {
  const layoutDir = path.resolve(__dirname, lookIn);
  const files = fs.readdirSync(layoutDir);
  const entries = {};

  files.forEach((file) => {
    if (file.endsWith('.scss')) {
      const name = path.parse(file).name;
      entries[name] = path.join(layoutDir, file);
    }
  });

  return entries;
}
function assetsFileNames(assetInfo) {
  const ext = path.extname(assetInfo.name);
  const name = path.basename(assetInfo.name, ext);

  if (ext === '.css' && name !== 'mainStyles') return `css/layout/${name}[extname]`;
  if (ext === '.css') return `css/${name}[extname]`;

  if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.avif'].includes(ext))
    return `assets/img/${name}-[hash][extname]`;

  return `assets/${name}-[hash][extname]`;
}
function getHtmlInputs() {
  const files = fg.sync('src/**/*.html', { onlyFiles: true });
  return Object.fromEntries(
    files.map((file) => [
      file.replace(/^src\//, '').replace(/\.html$/, ''),
      path.resolve(__dirname, file),
    ])
  );
}

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  base: '/Furniro/',

  // Keep assets structure 1:1:
  // src/public/** -> dist/**
  publicDir: path.resolve(__dirname, 'public'),

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: true,

    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/js/main.js'),
        // mainStyles: path.resolve(__dirname, 'src/scss/main.scss'),
        ...getLayoutEntries('src/scss/layouts'),
        ...getHtmlInputs(),
      },

      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',

        assetFileNames: assetsFileNames,

        manualChunks(id) {
          if (id.includes('node_modules')) return 'lib';
        },
      },
    },
  },

  server: {
    open: '/index.html',
    // cors: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@js': path.resolve(__dirname, 'src/js'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
    },
  },

  plugins: [
    sharpImageminPlugin({
      inputDir: '.',
      makeWebp: true,
      webpQuality: 75,
      jpegQuality: 75,
      pngCompressionLevel: 9,
      avifQuality: 60,
    }),
  ],

  css: {
    devSourcemap: true,
    postcss: {
      plugins: [autoprefixer()],
    },
    preprocessorOptions: {
      scss: {
        api: 'modern',
        silenceDeprecations: ['import'],
        additionalData: `@use "@/scss/general/_variables.scss" as *;\n`,
      },
    },
  },
});
