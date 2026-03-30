import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FuseCardComponent } from './fuse-card.component';

describe('FuseCardComponent', () => {
  let fixture: ComponentFixture<FuseCardComponent>;
  let component: FuseCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders the host element with fuse-card class', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-card');
  });

  it('renders header, body, and footer slot wrappers', () => {
    expect(fixture.nativeElement.querySelector('.fuse-card__header')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fuse-card__body')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fuse-card__footer')).toBeTruthy();
  });

  // ─── Variant input ──────────────────────────────────────────────────────────

  it('applies elevated class by default', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-card--elevated');
  });

  it('applies flat class when variant is flat', () => {
    fixture.componentRef.setInput('variant', 'flat');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-card--flat');
    expect(fixture.nativeElement.classList).not.toContain('fuse-card--elevated');
  });

  it('applies outlined class when variant is outlined', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-card--outlined');
  });

  // ─── Padding input ──────────────────────────────────────────────────────────

  it('applies padding-md class by default', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-card--padding-md');
  });

  it('applies padding-none class', () => {
    fixture.componentRef.setInput('padding', 'none');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-card--padding-none');
  });

  it('applies padding-sm class', () => {
    fixture.componentRef.setInput('padding', 'sm');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-card--padding-sm');
  });

  it('applies padding-lg class', () => {
    fixture.componentRef.setInput('padding', 'lg');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-card--padding-lg');
  });

  // ─── Clickable input ────────────────────────────────────────────────────────

  it('does not apply clickable class when clickable is false', () => {
    expect(fixture.nativeElement.classList).not.toContain('fuse-card--clickable');
  });

  it('applies clickable class when clickable is true', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-card--clickable');
  });

  // ─── cardClick output ───────────────────────────────────────────────────────

  it('does NOT emit cardClick when not clickable and host is clicked', () => {
    const emitted: MouseEvent[] = [];
    component.cardClick.subscribe((e: MouseEvent) => emitted.push(e));

    fixture.nativeElement.dispatchEvent(new MouseEvent('click'));
    expect(emitted.length).toBe(0);
  });

  it('emits cardClick when clickable and host is clicked', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();

    const emitted: MouseEvent[] = [];
    component.cardClick.subscribe((e: MouseEvent) => emitted.push(e));

    fixture.nativeElement.dispatchEvent(new MouseEvent('click'));
    expect(emitted.length).toBe(1);
  });

  // ─── Hovered signal ─────────────────────────────────────────────────────────

  it('sets hovered signal on mouseenter', () => {
    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    // hovered=true, but clickable=false so no hovered class
    expect(fixture.nativeElement.classList).not.toContain('fuse-card--hovered');
  });

  it('applies hovered class on mouseenter when clickable', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();

    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('fuse-card--hovered');
  });

  it('removes hovered class on mouseleave', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();

    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).not.toContain('fuse-card--hovered');
  });
});

// ─── ng-content slot tests ────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseCardComponent],
  template: `
    <fuse-card>
      <div fuseCardHeader>Header text</div>
      <div fuseCardBody>Body text</div>
      <div fuseCardFooter>Footer text</div>
    </fuse-card>
  `,
})
class CardSlotsHost {}

describe('FuseCardComponent slots', () => {
  it('projects header, body and footer content', async () => {
    await TestBed.configureTestingModule({ imports: [CardSlotsHost] }).compileComponents();
    const f = TestBed.createComponent(CardSlotsHost);
    f.detectChanges();

    const header = f.nativeElement.querySelector('.fuse-card__header');
    const body   = f.nativeElement.querySelector('.fuse-card__body');
    const footer = f.nativeElement.querySelector('.fuse-card__footer');

    expect(header.textContent.trim()).toBe('Header text');
    expect(body.textContent.trim()).toBe('Body text');
    expect(footer.textContent.trim()).toBe('Footer text');
  });
});
