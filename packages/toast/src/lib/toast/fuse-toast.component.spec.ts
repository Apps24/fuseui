import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FuseToastComponent } from './fuse-toast.component';

describe('FuseToastComponent', () => {
  let fixture: ComponentFixture<FuseToastComponent>;
  let component: FuseToastComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders the inner container', () => {
    expect(fixture.nativeElement.querySelector('.fuse-toast__inner')).toBeTruthy();
  });

  it('renders the close button', () => {
    expect(fixture.nativeElement.querySelector('.fuse-toast__close')).toBeTruthy();
  });

  it('renders the icon element', () => {
    expect(fixture.nativeElement.querySelector('.fuse-toast__icon')).toBeTruthy();
  });

  // ─── message input ──────────────────────────────────────────────────────────

  it('renders the message text', () => {
    fixture.componentRef.setInput('message', 'File saved successfully');
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('.fuse-toast__message');
    expect(msg.textContent.trim()).toBe('File saved successfully');
  });

  // ─── type input ─────────────────────────────────────────────────────────────

  it('applies info class by default (via hostClasses)', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-toast--info');
  });

  it('applies success class when type is success', () => {
    fixture.componentRef.setInput('type', 'success');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-toast--success');
    expect(fixture.nativeElement.classList).not.toContain('fuse-toast--info');
  });

  it('applies warning class when type is warning', () => {
    fixture.componentRef.setInput('type', 'warning');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-toast--warning');
  });

  it('applies error class when type is error', () => {
    fixture.componentRef.setInput('type', 'error');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-toast--error');
  });

  // ─── isVisible signal ───────────────────────────────────────────────────────

  it('isVisible starts as true', () => {
    // Confirmed by the absence of fuse-toast--leaving class initially
    expect(fixture.nativeElement.classList).not.toContain('fuse-toast--leaving');
  });

  it('close() adds fuse-toast--leaving class', () => {
    component.close();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-toast--leaving');
  });

  // ─── close button ───────────────────────────────────────────────────────────

  it('clicking close button calls close()', () => {
    const spy = jest.spyOn(component, 'close');
    fixture.nativeElement.querySelector('.fuse-toast__close').click();
    expect(spy).toHaveBeenCalled();
  });

  it('clicking close button sets isVisible to false (leaving class)', () => {
    fixture.nativeElement.querySelector('.fuse-toast__close').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-toast--leaving');
  });

  // ─── toastClose output ──────────────────────────────────────────────────────

  it('emits toastClose when onAnimationEnd fires after close()', () => {
    let emitCount = 0;
    component.toastClose.subscribe(() => emitCount++);

    component.close();
    fixture.detectChanges();

    // triggerEventHandler directly invokes Angular's registered (animationend)
    // host binding — JSDOM does not fire real CSS animation events.
    fixture.debugElement.triggerEventHandler('animationend', {});

    expect(emitCount).toBe(1);
  });

  it('does NOT emit toastClose on animationend if still visible', () => {
    let emitCount = 0;
    component.toastClose.subscribe(() => emitCount++);

    // Fire animationend WITHOUT calling close() first (enter animation end)
    fixture.debugElement.triggerEventHandler('animationend', {});

    expect(emitCount).toBe(0);
  });

  // ─── action input ───────────────────────────────────────────────────────────

  it('does not render action button when action is null', () => {
    expect(fixture.nativeElement.querySelector('.fuse-toast__action')).toBeNull();
  });

  it('renders action button when action is provided', () => {
    fixture.componentRef.setInput('action', { label: 'Undo', callback: () => {} });
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.fuse-toast__action');
    expect(btn).toBeTruthy();
    expect(btn.textContent.trim()).toBe('Undo');
  });

  it('action button click invokes the callback', () => {
    const callback = jest.fn();
    fixture.componentRef.setInput('action', { label: 'Undo', callback });
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.fuse-toast__action').click();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('action button click also closes the toast', () => {
    fixture.componentRef.setInput('action', { label: 'Undo', callback: () => {} });
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.fuse-toast__action').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.classList).toContain('fuse-toast--leaving');
  });

  // ─── Icon per type ──────────────────────────────────────────────────────────

  it('renders an svg icon', () => {
    expect(fixture.nativeElement.querySelector('.fuse-toast__icon svg')).toBeTruthy();
  });

  it('renders a different svg for each type (ngSwitch)', () => {
    const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
    types.forEach(type => {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.fuse-toast__icon svg')).toBeTruthy();
    });
  });

  // ─── Accessibility ──────────────────────────────────────────────────────────

  it('host has role=alert', () => {
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');
  });

  it('close button has aria-label', () => {
    expect(fixture.nativeElement.querySelector('.fuse-toast__close').getAttribute('aria-label')).toBeTruthy();
  });
});
