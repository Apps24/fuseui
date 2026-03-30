import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseAccordionComponent } from './fuse-accordion.component';
import { FuseAccordionItemComponent } from './fuse-accordion-item.component';

// ─── Test host ────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseAccordionComponent, FuseAccordionItemComponent],
  template: `
    <fuse-accordion [multiple]="multiple">
      <fuse-accordion-item itemId="a" title="Item A">Content A</fuse-accordion-item>
      <fuse-accordion-item itemId="b" title="Item B">Content B</fuse-accordion-item>
      <fuse-accordion-item itemId="c" title="Item C" [disabled]="true">Content C</fuse-accordion-item>
    </fuse-accordion>
  `,
})
class TestHostComponent {
  multiple = false;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function triggers(fix: ComponentFixture<unknown>): HTMLButtonElement[] {
  return Array.from(fix.nativeElement.querySelectorAll('.fuse-accordion__trigger'));
}

function items(fix: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(fix.nativeElement.querySelectorAll('fuse-accordion-item'));
}

// ─── FuseAccordionComponent ───────────────────────────────────────────────────

describe('FuseAccordionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let accordion: FuseAccordionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    accordion = fixture.debugElement.query(
      el => el.componentInstance instanceof FuseAccordionComponent
    ).componentInstance;
  });

  // ── Rendering ───────────────────────────────────────────────────────────────

  it('renders three accordion items', () => {
    expect(items(fixture).length).toBe(3);
  });

  it('renders a trigger button for each item', () => {
    expect(triggers(fixture).length).toBe(3);
  });

  it('renders item titles', () => {
    const btns = triggers(fixture);
    expect(btns[0].textContent).toContain('Item A');
    expect(btns[1].textContent).toContain('Item B');
  });

  // ── Collapsed by default ─────────────────────────────────────────────────────

  it('all items are closed by default', () => {
    expect(accordion.openIds().size).toBe(0);
  });

  it('aria-expanded is false on all items by default', () => {
    items(fixture).forEach(el =>
      expect(el.getAttribute('aria-expanded')).toBe('false')
    );
  });

  // ── Toggle open ──────────────────────────────────────────────────────────────

  it('opens an item on trigger click', () => {
    triggers(fixture)[0].click();
    fixture.detectChanges();
    expect(accordion.isOpen('a')).toBe(true);
  });

  it('sets aria-expanded="true" on the opened item', () => {
    triggers(fixture)[0].click();
    fixture.detectChanges();
    expect(items(fixture)[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('applies open class to the opened item', () => {
    triggers(fixture)[0].click();
    fixture.detectChanges();
    expect(items(fixture)[0].classList).toContain('fuse-accordion-item--open');
  });

  // ── Toggle close ─────────────────────────────────────────────────────────────

  it('closes an open item on second trigger click', () => {
    triggers(fixture)[0].click();
    fixture.detectChanges();
    triggers(fixture)[0].click();
    fixture.detectChanges();
    expect(accordion.isOpen('a')).toBe(false);
  });

  // ── Single mode (default) ────────────────────────────────────────────────────

  it('closes previous item when another opens in single mode', () => {
    triggers(fixture)[0].click();
    fixture.detectChanges();
    triggers(fixture)[1].click();
    fixture.detectChanges();
    expect(accordion.isOpen('a')).toBe(false);
    expect(accordion.isOpen('b')).toBe(true);
  });

  it('only one item can be open at a time in single mode', () => {
    triggers(fixture)[0].click();
    fixture.detectChanges();
    triggers(fixture)[1].click();
    fixture.detectChanges();
    expect(accordion.openIds().size).toBe(1);
  });

  // ── Multiple mode ─────────────────────────────────────────────────────────────

  it('allows multiple items open when multiple=true', () => {
    host.multiple = true;
    fixture.detectChanges();
    triggers(fixture)[0].click();
    fixture.detectChanges();
    triggers(fixture)[1].click();
    fixture.detectChanges();
    expect(accordion.isOpen('a')).toBe(true);
    expect(accordion.isOpen('b')).toBe(true);
    expect(accordion.openIds().size).toBe(2);
  });

  // ── Disabled ─────────────────────────────────────────────────────────────────

  it('disables the trigger button for disabled items', () => {
    expect(triggers(fixture)[2].disabled).toBe(true);
  });

  it('does not open a disabled item', () => {
    triggers(fixture)[2].click();
    fixture.detectChanges();
    expect(accordion.isOpen('c')).toBe(false);
  });

  // ── ARIA / Accessibility ─────────────────────────────────────────────────────

  it('trigger id matches aria-controls on body', () => {
    const trigger = triggers(fixture)[0];
    const body = fixture.nativeElement.querySelector(`#body-a`);
    expect(trigger.id).toBe('trigger-a');
    expect(trigger.getAttribute('aria-controls')).toBe('body-a');
    expect(body).toBeTruthy();
  });

  it('body has aria-labelledby pointing to trigger', () => {
    const body = fixture.nativeElement.querySelector('#body-a');
    expect(body?.getAttribute('aria-labelledby')).toBe('trigger-a');
  });

  it('body has role="region"', () => {
    const body = fixture.nativeElement.querySelector('#body-a');
    expect(body?.getAttribute('role')).toBe('region');
  });

  // ── toggle() / isOpen() programmatic API ─────────────────────────────────────

  it('toggle() opens a closed item', () => {
    accordion.toggle('a');
    expect(accordion.isOpen('a')).toBe(true);
  });

  it('toggle() closes an open item', () => {
    accordion.toggle('a');
    accordion.toggle('a');
    expect(accordion.isOpen('a')).toBe(false);
  });

  it('isOpen() returns false for unknown id', () => {
    expect(accordion.isOpen('zzz')).toBe(false);
  });
});
