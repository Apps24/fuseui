import { Component, OnInit } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';

/* ── helpers ─────────────────────────────────────────────────────────────── */

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

interface TokenRow { name: string; value: string; }

function collectVars(prefix: string, names: string[]): TokenRow[] {
  return names.map(n => ({ name: n, value: cssVar(n) }));
}

/* ── token lists (mirror tokens/ source files) ───────────────────────────── */

const COLOR_NAMES = [
  /* primitives */
  '--fuse-color-blue-50','--fuse-color-blue-100','--fuse-color-blue-200',
  '--fuse-color-blue-400','--fuse-color-blue-500','--fuse-color-blue-600','--fuse-color-blue-900',
  '--fuse-color-neutral-0','--fuse-color-neutral-50','--fuse-color-neutral-100',
  '--fuse-color-neutral-200','--fuse-color-neutral-400','--fuse-color-neutral-600','--fuse-color-neutral-900',
  '--fuse-color-red-50','--fuse-color-red-500','--fuse-color-red-600','--fuse-color-red-900',
  '--fuse-color-green-50','--fuse-color-green-500','--fuse-color-green-600','--fuse-color-green-900',
  '--fuse-color-amber-50','--fuse-color-amber-500','--fuse-color-amber-600','--fuse-color-amber-900',
  /* semantic */
  '--fuse-color-primary','--fuse-color-primary-dark','--fuse-color-on-primary',
  '--fuse-color-secondary','--fuse-color-on-secondary',
  '--fuse-color-success','--fuse-color-on-success',
  '--fuse-color-warning','--fuse-color-on-warning',
  '--fuse-color-danger','--fuse-color-on-danger',
  '--fuse-color-bg-surface','--fuse-color-bg-elevated','--fuse-color-bg-overlay',
  '--fuse-color-text-primary','--fuse-color-text-secondary','--fuse-color-text-disabled',
  '--fuse-color-border-default','--fuse-color-border-focus','--fuse-color-border-error',
];

const SPACING_NAMES = [
  '--fuse-spacing-0','--fuse-spacing-1','--fuse-spacing-2','--fuse-spacing-3',
  '--fuse-spacing-4','--fuse-spacing-5','--fuse-spacing-6','--fuse-spacing-8',
  '--fuse-spacing-10','--fuse-spacing-12','--fuse-spacing-16',
];

const RADIUS_NAMES = [
  '--fuse-radius-sm','--fuse-radius-md','--fuse-radius-lg',
  '--fuse-radius-xl','--fuse-radius-full',
];

const SHADOW_NAMES = [
  '--fuse-shadow-sm','--fuse-shadow-md','--fuse-shadow-lg','--fuse-shadow-xl',
];

/* ── showcase component ──────────────────────────────────────────────────── */

@Component({
  selector: 'fuse-token-showcase',
  standalone: true,
  imports: [],
  template: `
    <div class="wrap">

      <!-- COLORS -->
      <section>
        <h2>Colors</h2>
        <div class="swatches">
          @for (t of colors; track t.name) {
          <div class="swatch-card">
            <div class="swatch-box"
                 [style.background]="t.value || 'transparent'"
                 [style.border]="'1px solid var(--fuse-color-border-default)'">
            </div>
            <div class="swatch-label">
              <span class="var-name">{{ t.name }}</span>
              <span class="var-value">{{ t.value || '(empty)' }}</span>
            </div>
          </div>
          }
        </div>
      </section>

      <!-- SPACING -->
      <section>
        <h2>Spacing</h2>
        <div class="spacing-list">
          @for (t of spacings; track t.name) {
          <div class="spacing-row">
            <span class="var-name">{{ t.name }}</span>
            <div class="spacing-bar"
                 [style.width]="t.value"
                 [style.min-width]="'4px'">
            </div>
            <span class="var-value">{{ t.value }}</span>
          </div>
          }
        </div>
      </section>

      <!-- RADIUS -->
      <section>
        <h2>Border Radius</h2>
        <div class="radius-list">
          @for (t of radii; track t.name) {
          <div class="radius-row">
            <span class="var-name">{{ t.name }}</span>
            <div class="radius-box"
                 [style.border-radius]="t.value">
            </div>
            <span class="var-value">{{ t.value }}</span>
          </div>
          }
        </div>
      </section>

      <!-- SHADOWS -->
      <section>
        <h2>Shadows</h2>
        <div class="shadow-list">
          @for (t of shadows; track t.name) {
          <div class="shadow-card">
            <div class="shadow-box" [style.box-shadow]="t.value"></div>
            <span class="var-name">{{ t.name }}</span>
            <span class="var-value">{{ t.value }}</span>
          </div>
          }
        </div>
      </section>

    </div>
  `,
  styles: [`
    .wrap {
      padding: 24px;
      font-family: system-ui, sans-serif;
      color: var(--fuse-color-text-primary, #171717);
      background: var(--fuse-color-bg-surface, #fff);
      min-height: 100vh;
    }
    h2 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 32px 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--fuse-color-border-default, #e5e5e5);
    }

    /* colors */
    .swatches { display: flex; flex-wrap: wrap; gap: 12px; }
    .swatch-card { display: flex; flex-direction: column; gap: 4px; width: 140px; }
    .swatch-box { height: 48px; border-radius: 6px; }
    .swatch-label { display: flex; flex-direction: column; gap: 2px; }

    /* spacing */
    .spacing-list { display: flex; flex-direction: column; gap: 8px; }
    .spacing-row {
      display: flex; align-items: center; gap: 12px;
    }
    .spacing-bar {
      height: 16px;
      background: var(--fuse-color-primary, #3880ff);
      border-radius: 2px;
      flex-shrink: 0;
    }

    /* radius */
    .radius-list { display: flex; flex-direction: column; gap: 12px; }
    .radius-row { display: flex; align-items: center; gap: 16px; }
    .radius-box {
      width: 64px; height: 64px; flex-shrink: 0;
      background: var(--fuse-color-secondary, #dbeafe);
      border: 2px solid var(--fuse-color-primary, #3880ff);
    }

    /* shadows */
    .shadow-list { display: flex; flex-wrap: wrap; gap: 24px; }
    .shadow-card { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .shadow-box {
      width: 80px; height: 80px;
      background: var(--fuse-color-bg-surface, #fff);
      border-radius: 8px;
    }

    /* shared text */
    .var-name  { font-size: 0.75rem; font-weight: 600; font-family: monospace; }
    .var-value { font-size: 0.7rem;  color: var(--fuse-color-text-secondary, #525252); font-family: monospace; }
  `],
})
class TokenShowcaseComponent implements OnInit {
  colors: TokenRow[] = [];
  spacings: TokenRow[] = [];
  radii: TokenRow[] = [];
  shadows: TokenRow[] = [];

  ngOnInit(): void {
    this.colors   = collectVars('color',   COLOR_NAMES);
    this.spacings = collectVars('spacing', SPACING_NAMES);
    this.radii    = collectVars('radius',  RADIUS_NAMES);
    this.shadows  = collectVars('shadow',  SHADOW_NAMES);
  }
}

/* ── meta ─────────────────────────────────────────────────────────────────── */

const meta: Meta<TokenShowcaseComponent> = {
  title: 'Fuse / Design Tokens',
  component: TokenShowcaseComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<TokenShowcaseComponent>;

export const AllTokens: Story = {};
