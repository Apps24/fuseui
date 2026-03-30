import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseSliderComponent, FuseSliderMark } from './fuse-slider.component';

// ─── Test host ────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseSliderComponent],
  template: `
    <fuse-slider
      [min]="min"
      [max]="max"
      [step]="step"
      [range]="range"
      [showTooltip]="showTooltip"
      [showMarks]="showMarks"
      [marks]="marks"
      [(value)]="value">
    </fuse-slider>
  `,
})
class TestHostComponent {
  min         = 0;
  max         = 100;
  step        = 1;
  range       = false;
  showTooltip: 'always' | 'hover' | 'never' = 'hover';
  showMarks   = false;
  marks: FuseSliderMark[] = [];
  value: number | [number, number] = 50;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const track  = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelector('.fuse-slider__track') as HTMLElement;

const thumb  = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelector('.fuse-slider__thumb') as HTMLElement | null;

const thumbs = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelectorAll('.fuse-slider__thumb') as NodeListOf<HTMLElement>;

const tooltip = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelector('.fuse-slider__tooltip') as HTMLElement | null;

const fill   = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelector('.fuse-slider__fill') as HTMLElement;

const key = (el: HTMLElement, k: string) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FuseSliderComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders the track element', () => {
    expect(track(fixture)).toBeTruthy();
  });

  it('renders a single thumb for non-range mode', () => {
    expect(thumbs(fixture).length).toBe(1);
  });

  it('thumb has role="slider"', () => {
    expect(thumb(fixture)?.getAttribute('role')).toBe('slider');
  });

  it('thumb has tabindex="0"', () => {
    expect(thumb(fixture)?.getAttribute('tabindex')).toBe('0');
  });

  it('renders the fill bar', () => {
    expect(fill(fixture)).toBeTruthy();
  });

  // ── ARIA ──────────────────────────────────────────────────────────────────

  it('thumb aria-valuemin / aria-valuemax / aria-valuenow', () => {
    const t = thumb(fixture)!;
    expect(t.getAttribute('aria-valuemin')).toBe('0');
    expect(t.getAttribute('aria-valuemax')).toBe('100');
    expect(t.getAttribute('aria-valuenow')).toBe('50');
  });

  it('updates aria-valuenow when value changes', () => {
    host.value = 75;
    fixture.detectChanges();
    expect(thumb(fixture)!.getAttribute('aria-valuenow')).toBe('75');
  });

  // ── fillPercent ───────────────────────────────────────────────────────────

  it('fill width% reflects single value (50 → 50%)', () => {
    host.value = 50;
    fixture.detectChanges();
    const comp = fixture.debugElement.children[0].componentInstance as FuseSliderComponent;
    expect(comp.fillPercent().to).toBe(50);
    expect(comp.fillPercent().from).toBe(0);
  });

  it('fill width% reflects single value (0 → 0%)', () => {
    host.value = 0;
    fixture.detectChanges();
    const comp = fixture.debugElement.children[0].componentInstance as FuseSliderComponent;
    expect(comp.fillPercent().to).toBe(0);
  });

  it('fill width% reflects single value (100 → 100%)', () => {
    host.value = 100;
    fixture.detectChanges();
    const comp = fixture.debugElement.children[0].componentInstance as FuseSliderComponent;
    expect(comp.fillPercent().to).toBe(100);
  });

  it('thumb left% matches fillPercent.to', () => {
    host.value = 25;
    fixture.detectChanges();
    expect(thumb(fixture)!.style.left).toBe('25%');
  });

  // ── Keyboard — single ─────────────────────────────────────────────────────

  it('ArrowRight increments value by step', () => {
    host.value = 50; fixture.detectChanges();
    key(thumb(fixture)!, 'ArrowRight');
    fixture.detectChanges();
    expect(host.value).toBe(51);
  });

  it('ArrowLeft decrements value by step', () => {
    host.value = 50; fixture.detectChanges();
    key(thumb(fixture)!, 'ArrowLeft');
    fixture.detectChanges();
    expect(host.value).toBe(49);
  });

  it('ArrowUp increments value', () => {
    host.value = 50; fixture.detectChanges();
    key(thumb(fixture)!, 'ArrowUp');
    fixture.detectChanges();
    expect(host.value).toBe(51);
  });

  it('ArrowDown decrements value', () => {
    host.value = 50; fixture.detectChanges();
    key(thumb(fixture)!, 'ArrowDown');
    fixture.detectChanges();
    expect(host.value).toBe(49);
  });

  it('Home sets value to min', () => {
    host.value = 50; fixture.detectChanges();
    key(thumb(fixture)!, 'Home');
    fixture.detectChanges();
    expect(host.value).toBe(0);
  });

  it('End sets value to max', () => {
    host.value = 50; fixture.detectChanges();
    key(thumb(fixture)!, 'End');
    fixture.detectChanges();
    expect(host.value).toBe(100);
  });

  it('ArrowRight clamps at max', () => {
    host.value = 100; fixture.detectChanges();
    key(thumb(fixture)!, 'ArrowRight');
    fixture.detectChanges();
    expect(host.value).toBe(100);
  });

  it('ArrowLeft clamps at min', () => {
    host.value = 0; fixture.detectChanges();
    key(thumb(fixture)!, 'ArrowLeft');
    fixture.detectChanges();
    expect(host.value).toBe(0);
  });

  it('custom step applied on keyboard', () => {
    host.step  = 5;
    host.value = 50;
    fixture.detectChanges();
    key(thumb(fixture)!, 'ArrowRight');
    fixture.detectChanges();
    expect(host.value).toBe(55);
  });

  // ── Tooltip ───────────────────────────────────────────────────────────────

  it('tooltip hidden by default with showTooltip="hover"', () => {
    expect(tooltip(fixture)).toBeNull();
  });

  it('tooltip shown with showTooltip="always"', () => {
    host.showTooltip = 'always'; fixture.detectChanges();
    expect(tooltip(fixture)).toBeTruthy();
  });

  it('tooltip hidden with showTooltip="never" even when focused', () => {
    host.showTooltip = 'never'; fixture.detectChanges();
    thumb(fixture)!.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    fixture.detectChanges();
    expect(tooltip(fixture)).toBeNull();
  });

  it('tooltip shown on focus with showTooltip="hover"', () => {
    thumb(fixture)!.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    fixture.detectChanges();
    expect(tooltip(fixture)).toBeTruthy();
  });

  it('tooltip hidden after blur', () => {
    thumb(fixture)!.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    fixture.detectChanges();
    thumb(fixture)!.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    fixture.detectChanges();
    expect(tooltip(fixture)).toBeNull();
  });

  it('tooltip displays current value', () => {
    host.showTooltip = 'always';
    host.value       = 42;
    fixture.detectChanges();
    expect(tooltip(fixture)!.textContent?.trim()).toBe('42');
  });

  // ── Range mode ────────────────────────────────────────────────────────────

  it('renders two thumbs in range mode', () => {
    host.range = true;
    host.value = [20, 80];
    fixture.detectChanges();
    expect(thumbs(fixture).length).toBe(2);
  });

  it('range fill reflects from/to correctly', () => {
    host.range = true;
    host.value = [25, 75];
    fixture.detectChanges();
    const comp = fixture.debugElement.children[0].componentInstance as FuseSliderComponent;
    expect(comp.fillPercent().from).toBe(25);
    expect(comp.fillPercent().to).toBe(75);
  });

  it('low thumb has correct aria-valuenow in range mode', () => {
    host.range = true;
    host.value = [30, 70];
    fixture.detectChanges();
    const low = fixture.nativeElement.querySelector('.fuse-slider__thumb--low') as HTMLElement;
    expect(low.getAttribute('aria-valuenow')).toBe('30');
  });

  it('high thumb has correct aria-valuenow in range mode', () => {
    host.range = true;
    host.value = [30, 70];
    fixture.detectChanges();
    const high = fixture.nativeElement.querySelector('.fuse-slider__thumb--high') as HTMLElement;
    expect(high.getAttribute('aria-valuenow')).toBe('70');
  });

  it('ArrowRight on low thumb increases low value', () => {
    host.range = true;
    host.value = [30, 70];
    fixture.detectChanges();
    const low = fixture.nativeElement.querySelector('.fuse-slider__thumb--low') as HTMLElement;
    key(low, 'ArrowRight');
    fixture.detectChanges();
    expect((host.value as [number, number])[0]).toBe(31);
  });

  it('ArrowLeft on high thumb decreases high value', () => {
    host.range = true;
    host.value = [30, 70];
    fixture.detectChanges();
    const high = fixture.nativeElement.querySelector('.fuse-slider__thumb--high') as HTMLElement;
    key(high, 'ArrowLeft');
    fixture.detectChanges();
    expect((host.value as [number, number])[1]).toBe(69);
  });

  // ── Marks ─────────────────────────────────────────────────────────────────

  it('marks not rendered when showMarks=false', () => {
    expect(fixture.nativeElement.querySelector('.fuse-slider__marks')).toBeNull();
  });

  it('marks rendered when showMarks=true with marks[]', () => {
    host.showMarks = true;
    host.marks     = [{ value: 0, label: 'Low' }, { value: 50, label: 'Mid' }, { value: 100, label: 'High' }];
    fixture.detectChanges();
    const markEls = fixture.nativeElement.querySelectorAll('.fuse-slider__mark');
    expect(markEls.length).toBe(3);
  });

  it('mark labels are rendered', () => {
    host.showMarks = true;
    host.marks     = [{ value: 0, label: 'Low' }, { value: 100, label: 'High' }];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Low');
    expect(fixture.nativeElement.textContent).toContain('High');
  });

  it('marks not rendered when showMarks=true but marks=[]', () => {
    host.showMarks = true;
    host.marks     = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-slider__marks')).toBeNull();
  });

  // ── Custom min/max ────────────────────────────────────────────────────────

  it('custom min/max respected in fillPercent', () => {
    host.min   = 50;
    host.max   = 150;
    host.value = 100; // midpoint → 50%
    fixture.detectChanges();
    const comp = fixture.debugElement.children[0].componentInstance as FuseSliderComponent;
    expect(comp.fillPercent().to).toBe(50);
  });
});
