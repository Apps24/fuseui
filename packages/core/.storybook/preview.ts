/* ─── Global styles ──────────────────────────────────────────────────────── */
import '../src/lib/tokens/generated/variables.css';
import '../src/lib/styles/_themes.scss';
import '../src/lib/styles/_ionic-bridge.scss';
import '../src/lib/styles/_animations.scss';
import '../src/lib/styles/_fluid-typography.scss';

import type { Preview } from '@storybook/angular';

// ─── Types ────────────────────────────────────────────────────────────────────

type Globals = { theme: string; reduceMotion: 'off' | 'on' };

// ─── Toolbar definitions ──────────────────────────────────────────────────────

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', icon: 'sun',       title: 'Light'  },
          { value: 'dark',  icon: 'moon',      title: 'Dark'   },
          { value: 'ocean', icon: 'globe',     title: 'Ocean'  },
          { value: 'rose',  icon: 'heart',     title: 'Rose'   },
        ],
        dynamicTitle: true,
      },
    },
    reduceMotion: {
      description: 'Reduce motion',
      defaultValue: 'off',
      toolbar: {
        title: 'Reduce Motion',
        icon: 'timer',
        items: [
          { value: 'off', icon: 'play',  title: 'Motion on'  },
          { value: 'on',  icon: 'stop',  title: 'Motion off' },
        ],
        dynamicTitle: true,
      },
    },
  },

  // ─── Decorator — applies tokens to every story canvas ──────────────────────

  decorators: [
    (storyFn, context) => {
      const { theme, reduceMotion } = context.globals as Globals;
      const root = document.documentElement;

      // ── Theme ──────────────────────────────────────────────────────────────
      root.setAttribute('data-theme', theme ?? 'light');

      // Ionic 8: .ion-palette-dark on :root for dark mode
      root.classList.toggle('ion-palette-dark', theme === 'dark');

      // Remove legacy Ionic 7 body.dark if previously set
      document.body.classList.remove('dark');

      // ── Reduce motion ──────────────────────────────────────────────────────
      if (reduceMotion === 'on') {
        root.setAttribute('data-reduce-motion', 'true');
      } else {
        root.removeAttribute('data-reduce-motion');
      }

      return storyFn();
    },
  ],

  parameters: {
    layout: 'centered',
  },
};

export default preview;
