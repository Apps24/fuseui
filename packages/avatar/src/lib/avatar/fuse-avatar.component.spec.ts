import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseAvatarComponent } from './fuse-avatar.component';

describe('FuseAvatarComponent', () => {
  let fixture: ComponentFixture<FuseAvatarComponent>;
  let component: FuseAvatarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Image rendering ────────────────────────────────────────────────────────

  it('shows img element when src is provided', () => {
    fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.fuse-avatar__img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/avatar.jpg');
  });

  it('sets alt attribute on img', () => {
    fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
    fixture.componentRef.setInput('alt', 'Jane Doe');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-avatar__img').getAttribute('alt')).toBe('Jane Doe');
  });

  it('does NOT show img when src is empty', () => {
    expect(fixture.nativeElement.querySelector('.fuse-avatar__img')).toBeNull();
  });

  // ─── Initials fallback ──────────────────────────────────────────────────────

  it('shows initials span when src is empty', () => {
    expect(fixture.nativeElement.querySelector('.fuse-avatar__initials')).toBeTruthy();
  });

  it('shows initials span after image load error', () => {
    fixture.componentRef.setInput('src', 'https://example.com/bad.jpg');
    fixture.componentRef.setInput('name', 'Jane Doe');
    fixture.detectChanges();

    // Simulate img error
    const img = fixture.nativeElement.querySelector('.fuse-avatar__img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.fuse-avatar__img')).toBeNull();
    expect(fixture.nativeElement.querySelector('.fuse-avatar__initials')).toBeTruthy();
  });

  // ─── Initials computation ───────────────────────────────────────────────────

  it('returns empty string when name is not set', () => {
    expect(component.initials()).toBe('');
  });

  it('returns first letter of a single-word name', () => {
    fixture.componentRef.setInput('name', 'Alice');
    fixture.detectChanges();
    expect(component.initials()).toBe('A');
  });

  it('returns first letters of first two words', () => {
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.detectChanges();
    expect(component.initials()).toBe('JD');
  });

  it('uses only first two words even when name has three words', () => {
    fixture.componentRef.setInput('name', 'Mary Jane Watson');
    fixture.detectChanges();
    expect(component.initials()).toBe('MJ');
  });

  it('uppercases initials', () => {
    fixture.componentRef.setInput('name', 'alice bob');
    fixture.detectChanges();
    expect(component.initials()).toBe('AB');
  });

  it('renders initials text in the DOM', () => {
    fixture.componentRef.setInput('name', 'Jane Doe');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.fuse-avatar__initials');
    expect(span.textContent.trim()).toBe('JD');
  });

  // ─── Size classes ───────────────────────────────────────────────────────────

  it('applies md size class by default', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-avatar--md');
  });

  it('applies xs size class', () => {
    fixture.componentRef.setInput('size', 'xs');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-avatar--xs');
  });

  it('applies sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-avatar--sm');
  });

  it('applies lg size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-avatar--lg');
  });

  it('applies xl size class', () => {
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-avatar--xl');
  });

  // ─── Shape classes ──────────────────────────────────────────────────────────

  it('applies circle shape class by default', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-avatar--circle');
  });

  it('applies square shape class', () => {
    fixture.componentRef.setInput('shape', 'square');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-avatar--square');
    expect(fixture.nativeElement.classList).not.toContain('fuse-avatar--circle');
  });

  // ─── Status indicator ───────────────────────────────────────────────────────

  it('does not render status dot when status is null', () => {
    expect(fixture.nativeElement.querySelector('.fuse-avatar__status')).toBeNull();
  });

  it('renders status dot when status is set', () => {
    fixture.componentRef.setInput('status', 'online');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-avatar__status')).toBeTruthy();
  });

  it('applies the correct status modifier class', () => {
    fixture.componentRef.setInput('status', 'busy');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-avatar__status--busy')).toBeTruthy();
  });

  it('applies offline status class', () => {
    fixture.componentRef.setInput('status', 'offline');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-avatar__status--offline')).toBeTruthy();
  });

  it('applies away status class', () => {
    fixture.componentRef.setInput('status', 'away');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-avatar__status--away')).toBeTruthy();
  });
});
