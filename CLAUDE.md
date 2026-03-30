# Fuse UI — Project Rules (Angular 18+)

## Identity
- Library: Fuse UI
- Workspace: fuseui/
- npm scope: @fuse/
- CSS token prefix: --fuse-
- Selector prefix: fuse-
- Story title: "Fuse / ComponentName"

## Version targets
- Angular peerDependency: >=18.0.0
- Ionic peerDependency: >=8.0.0 (optional)
- Node: >=20.0.0
- rxjs: >=7.4.0
- TypeScript: >=5.4.0

## Angular 18+ APIs — USE THESE

### Inputs / Outputs / Two-way binding
- ALWAYS: input<T>() for optional inputs
- ALWAYS: input.required<T>() for mandatory inputs
- ALWAYS: output<T>() for outputs
- ALWAYS: model<T>() for two-way bindable values (replaces @Input+@Output pair)
- NEVER: @Input() decorator (unless integrating legacy CDK APIs)
- NEVER: @Output() EventEmitter (unless integrating legacy CDK APIs)

### Template control flow
- ALWAYS: @if, @for (track required), @switch, @empty
- ALWAYS: @defer for heavy components (Data Table, Date Picker)
- NEVER: *ngIf, *ngFor, *ngSwitch, CommonModule in standalone components
- NOTE: @for MUST include track expression: @for (item of items(); track item.id)

### Signal queries
- ALWAYS: viewChild() / viewChildren() for template refs
- ALWAYS: contentChild() / contentChildren() for projected content
- NEVER: @ViewChild, @ViewChildren, @ContentChild, @ContentChildren decorators

### Reactivity
- signals, computed(), effect() — everywhere (services, components)
- linkedSignal() — Angular 19+, use only if targeting 19+
- takeUntilDestroyed(this.destroyRef) — for Observable subscription cleanup
- inject(DestroyRef) as class field initialiser

### Form integration
- model<T>() for components with [(value)] two-way binding
- ALSO implement ControlValueAccessor when ngModel / ReactiveFormsModule integration needed
- Both model() and CVA can coexist in the same component

## Styling — STRICT RULES
- ZERO hardcoded colours in any .scss
- ALL values via --fuse-* CSS custom properties
- :host-context(.ios) AND :host-context(.md) on EVERY component
- Animation: data-state attributes drive transitions (data-entering, data-leaving, data-pressed)
- @media (prefers-reduced-motion: reduce) on ALL animated properties
- [data-reduce-motion="true"] on :root overrides all animations (app-level)

## Animation principles (HeroUI-inspired)
- Transitions tied to data attributes, not class toggles
- Spring-feel: cubic-bezier(0.34, 1.56, 0.64, 1) for enter, ease-out for exit
- enter-scale: from 0.95 → 1 + opacity 0 → 1
- exit-scale: from 1 → 0.95 + opacity 1 → 0
- Duration: micro 100ms, fast 150ms, base 200ms, slow 300ms, enter 250ms
- Interruptible: use CSS transitions (not keyframes) on interactive elements
- Always include @media (prefers-reduced-motion: reduce) fallback

## Theme system
- data-theme attribute on :root controls active theme
- Themes: light (default), dark, ocean, rose, + consumer-defined
- All theme tokens defined as CSS custom property overrides in :root[data-theme="X"]
- FuseThemeService manages switching, persists to localStorage

## Ionic 8+ specifics
- Dark mode: import '@ionic/angular/css/palettes/dark.class.css' in angular.json
- Dark palette targets :root (NOT body)
- ion-palette-dark class on :root for programmatic dark mode
- Safe areas: var(--ion-safe-area-top/bottom)
- @Optional() on all Ionic service injections

## File structure
packages/[name]/src/lib/
  fuse-[name].component.ts
  fuse-[name].component.html   (separate file for 18+ control flow readability)
  fuse-[name].component.scss
  fuse-[name].component.spec.ts
  fuse-[name].component.stories.ts
