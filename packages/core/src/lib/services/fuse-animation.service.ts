import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FuseAnimationService {
  readonly reduceMotion = signal(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  constructor() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', (e) => this.reduceMotion.set(e.matches));
  }

  addEnterState(
    el: HTMLElement,
    type: 'overlay' | 'slide' | 'tooltip' | 'default' = 'default',
  ): void {
    if (this.reduceMotion()) return;
    const attr =
      type === 'default'  ? 'data-entering' :
      type === 'overlay'  ? 'data-overlay-entering' :
      type === 'slide'    ? 'data-slide-entering' :
                            'data-tooltip-entering';
    el.setAttribute(attr, '');
    el.addEventListener('animationend', () => el.removeAttribute(attr), { once: true });
  }

  addLeaveState(
    el: HTMLElement,
    onDone: () => void,
    type: 'overlay' | 'slide' | 'default' = 'default',
  ): void {
    if (this.reduceMotion()) { onDone(); return; }
    const attr =
      type === 'default' ? 'data-leaving' :
      type === 'overlay' ? 'data-overlay-leaving' :
                           'data-slide-leaving';
    el.setAttribute(attr, '');
    el.addEventListener('animationend', () => { el.removeAttribute(attr); onDone(); }, { once: true });
  }
}
