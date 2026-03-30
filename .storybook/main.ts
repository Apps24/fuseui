import type { StorybookConfig } from '@storybook/angular';
import type { InlineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Workspace root is one level up from .storybook/
const root = resolve(__dirname, '..');

const config: StorybookConfig = {
  stories: [
    '../packages/*/src/**/*.stories.@(ts|tsx)',
  ],

  addons: [],

  framework: {
    name: '@storybook/angular',
    options: {},
  },

  core: {
    builder: '@storybook/builder-vite',
  },

  docs: {
    autodocs: 'tag',
  },

  async viteFinal(config: InlineConfig): Promise<InlineConfig> {
    // Map every @fuse/* path alias → source entry point so Vite can resolve them
    const fuseAliases: Record<string, string> = {
      '@fuse/core':        resolve(root, 'packages/core/src/index.ts'),
      '@fuse/button':      resolve(root, 'packages/button/src/index.ts'),
      '@fuse/icon':        resolve(root, 'packages/icon/src/index.ts'),
      '@fuse/input':       resolve(root, 'packages/input/src/index.ts'),
      '@fuse/label':       resolve(root, 'packages/label/src/index.ts'),
      '@fuse/select':      resolve(root, 'packages/select/src/index.ts'),
      '@fuse/checkbox':    resolve(root, 'packages/checkbox/src/index.ts'),
      '@fuse/card':        resolve(root, 'packages/card/src/index.ts'),
      '@fuse/badge':       resolve(root, 'packages/badge/src/index.ts'),
      '@fuse/avatar':      resolve(root, 'packages/avatar/src/index.ts'),
      '@fuse/skeleton':    resolve(root, 'packages/skeleton/src/index.ts'),
      '@fuse/toast':       resolve(root, 'packages/toast/src/index.ts'),
      '@fuse/modal':       resolve(root, 'packages/modal/src/index.ts'),
      '@fuse/alert':       resolve(root, 'packages/alert/src/index.ts'),
      '@fuse/spinner':     resolve(root, 'packages/spinner/src/index.ts'),
      '@fuse/tabs':        resolve(root, 'packages/tabs/src/index.ts'),
      '@fuse/accordion':   resolve(root, 'packages/accordion/src/index.ts'),
      '@fuse/chip':        resolve(root, 'packages/chip/src/index.ts'),
      '@fuse/tooltip':     resolve(root, 'packages/tooltip/src/index.ts'),
      '@fuse/popover':     resolve(root, 'packages/popover/src/index.ts'),
      '@fuse/dropdown':    resolve(root, 'packages/dropdown/src/index.ts'),
      '@fuse/breadcrumb':  resolve(root, 'packages/breadcrumb/src/index.ts'),
      '@fuse/pagination':  resolve(root, 'packages/pagination/src/index.ts'),
      '@fuse/slider':      resolve(root, 'packages/slider/src/index.ts'),
      '@fuse/form-field':  resolve(root, 'packages/form-field/src/index.ts'),
      '@fuse/empty-state': resolve(root, 'packages/empty-state/src/index.ts'),
      '@fuse/table':       resolve(root, 'packages/table/src/index.ts'),
    };

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias as Record<string, string> ?? {}),
          ...fuseAliases,
        },
      },
    };
  },
};

export default config;
