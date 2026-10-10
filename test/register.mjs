// Lets `node --test` import the game's source directly: these hooks resolve
// extensionless imports (as parcel does) and compile JSX with Babel on the fly.
// Needs Node 22.15 or newer (module.registerHooks).
import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';
import { transformSync } from '@babel/core';

const srcDir = new URL('../src/', import.meta.url).href;

registerHooks({
  // The source imports './ships', './cell' and so on with no extension.
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && context.parentURL && context.parentURL.startsWith(srcDir)
      && !/\.\w+$/.test(specifier)) {
      const found = ['.js', '.jsx'].map((ext) => new URL(specifier + ext, context.parentURL))
        .find((url) => existsSync(fileURLToPath(url)));
      if (found) return { url: found.href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },

  // Source files are ES modules with JSX: compile only the JSX and load them as modules.
  load(url, context, nextLoad) {
    if (!url.startsWith(srcDir) || !/\.jsx?$/.test(url)) return nextLoad(url, context);
    const filename = fileURLToPath(url);
    const { code } = transformSync(readFileSync(filename, 'utf8'), {
      filename,
      babelrc: false,
      configFile: false,
      presets: ['@babel/preset-react'],
    });
    return { format: 'module', source: code, shortCircuit: true };
  },
});
