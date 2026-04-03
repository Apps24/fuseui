import type { StorybookConfig } from '@storybook/angular';
import { mergeConfig, type Plugin } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import * as sass from 'sass';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Inlines templateUrl and styleUrl/styleUrls in Angular component decorators
 * at Vite transform time, WITHOUT AOT-compiling the decorators.
 *
 * @storybook/angular uses JIT rendering and reads component.selector from the
 * original decorator metadata — AOT compilation (e.g. @analogjs) strips that
 * and breaks it. This plugin only substitutes file references with their
 * content, leaving the rest of the decorator (including selector) untouched.
 */
function angularInlineResources(): Plugin {
  return {
    name: 'fuse-angular-inline-resources',
    enforce: 'pre',
    transform(code, id) {
      if (
        !id.endsWith('.ts') ||
        id.includes('node_modules') ||
        id.includes('.spec.') ||
        id.includes('.stories.')
      ) return null;

      if (!code.includes('templateUrl') && !code.includes('styleUrl')) return null;

      const dir = path.dirname(id);
      let result = code;

      // templateUrl: './foo.html'  →  template: `<html…>`
      result = result.replace(
        /templateUrl:\s*['"`]([^'"`]+)['"`]/g,
        (_, p) => {
          const html = readFileSync(path.resolve(dir, p), 'utf-8')
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$\{/g, '\\${');
          return `template: \`${html}\``;
        },
      );

      // styleUrl: './foo.scss'  →  styles: [`css…`]
      result = result.replace(
        /styleUrl:\s*['"`]([^'"`]+)['"`]/g,
        (_, p) => {
          try {
            const css = sass
              .compile(path.resolve(dir, p), { style: 'compressed' })
              .css.replace(/`/g, '\\`')
              .replace(/\$\{/g, '\\${');
            return `styles: [\`${css}\`]`;
          } catch {
            return 'styles: []';
          }
        },
      );

      // styleUrls: ['./a.scss', './b.scss']  →  styles: [`…`, `…`]
      result = result.replace(
        /styleUrls:\s*\[([^\]]+)\]/g,
        (_, inner) => {
          const urls = [...inner.matchAll(/['"`]([^'"`]+)['"`]/g)].map((m) => m[1]);
          const parts = urls.map((p) => {
            try {
              const css = sass
                .compile(path.resolve(dir, p), { style: 'compressed' })
                .css.replace(/`/g, '\\`')
                .replace(/\$\{/g, '\\${');
              return `\`${css}\``;
            } catch {
              return '``';
            }
          });
          return `styles: [${parts.join(', ')}]`;
        },
      );

      return result !== code ? { code: result } : null;
    },
  };
}

const config: StorybookConfig = {
  stories: [
    // Core's own stories (importPath will be ./src/...)
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    // Sibling packages — explicit list avoids ../../*/src/** also matching core
    // (when workingDir=packages/core, ../../*/src/ covers ALL packages incl. core
    //  causing a specifier/importPath mismatch that crashes makeTitle)
    '../../button/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../icon/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../input/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../label/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../select/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../checkbox/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../card/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../badge/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../avatar/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../skeleton/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../toast/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../modal/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../alert/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../spinner/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal: async (config) => {
    // __dirname = packages/core/.storybook (injected by Storybook's bundler)
    const pkg = (name: string) =>
      path.resolve(__dirname, `../../${name}/src/index.ts`);

    return mergeConfig(config, {
      plugins: [
        // Inlines templateUrl / styleUrl at Vite transform time without AOT.
        // Keeps decorator metadata intact so @storybook/angular JIT can read
        // component.selector from the original @Component decorator.
        angularInlineResources(),
      ],
      define: {
        // Required by @storybook/angular's Ivy renderer when using the Vite builder
        STORYBOOK_ANGULAR_OPTIONS: JSON.stringify({ experimentalZoneless: false }),
      },
      optimizeDeps: {
        include: ['@angular/animations', '@angular/animations/browser'],
      },
      resolve: {
        alias: [
          // @fuse_ui/core points one level up (it IS the current package)
          { find: '@fuse_ui/core',     replacement: path.resolve(__dirname, '../src/index.ts') },
          { find: '@fuse_ui/button',   replacement: pkg('button') },
          { find: '@fuse_ui/icon',     replacement: pkg('icon') },
          { find: '@fuse_ui/input',    replacement: pkg('input') },
          { find: '@fuse_ui/label',    replacement: pkg('label') },
          { find: '@fuse_ui/select',   replacement: pkg('select') },
          { find: '@fuse_ui/checkbox', replacement: pkg('checkbox') },
          { find: '@fuse_ui/card',     replacement: pkg('card') },
          { find: '@fuse_ui/badge',    replacement: pkg('badge') },
          { find: '@fuse_ui/avatar',   replacement: pkg('avatar') },
          { find: '@fuse_ui/skeleton', replacement: pkg('skeleton') },
          { find: '@fuse_ui/toast',    replacement: pkg('toast') },
          { find: '@fuse_ui/modal',    replacement: pkg('modal') },
          { find: '@fuse_ui/alert',    replacement: pkg('alert') },
          { find: '@fuse_ui/spinner',  replacement: pkg('spinner') },
        ],
      },
    });
  },
};

export default config;
