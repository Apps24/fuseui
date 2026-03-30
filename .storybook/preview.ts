import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// ── Global Fuse token styles ──────────────────────────────────────────────────
// Import the design-token stylesheet so all --fuse-* variables are available
import '../packages/core/src/lib/styles/_themes.scss';
import '../packages/core/src/lib/styles/_fluid-typography.scss';
import '../packages/core/src/lib/styles/_animations.scss';

const preview: Preview = {
  globalTypes: {
    fuseTheme: {
      description: 'Fuse UI theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light',  icon: 'sun'     },
          { value: 'dark',  title: 'Dark',   icon: 'moon'    },
          { value: 'ocean', title: 'Ocean',  icon: 'globe'   },
          { value: 'rose',  title: 'Rose',   icon: 'heart'   },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    applicationConfig({
      providers: [provideAnimationsAsync()],
    }),
    (story, context) => {
      // Apply the selected theme to :root
      const theme = context.globals['fuseTheme'] ?? 'light';
      document.documentElement.setAttribute('data-theme', theme);
      return story();
    },
  ],

  parameters: {
    layout: 'centered',
    backgrounds: { disable: true }, // theme system handles background via --fuse-color-bg-surface
    controls: {
      matchers: {
        color:  /(background|color)$/i,
        date:   /Date$/i,
      },
    },
  },
};

export default preview;
