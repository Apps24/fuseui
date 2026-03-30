import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { FuseSelectComponent, FuseSelectOption } from './fuse-select.component';

const OPTIONS: FuseSelectOption[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
  { value: 'd', label: 'Delta' },
];

@Component({
  standalone: true,
  imports: [FuseSelectComponent, ReactiveFormsModule],
  template: `<fuse-select [options]="opts" [formControl]="ctrl"></fuse-select>`,
})
class TestHostComponent {
  opts = OPTIONS;
  ctrl = new FormControl(null);
}

describe('FuseSelectComponent', () => {
  let fixture: ComponentFixture<FuseSelectComponent>;
  let component: FuseSelectComponent;
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseSelectComponent, ReactiveFormsModule, OverlayModule],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();

    fixture = TestBed.createComponent(FuseSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.detectChanges();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the trigger button', () => {
    expect(fixture.debugElement.query(By.css('.fuse-select__trigger'))).toBeTruthy();
  });

  it('shows placeholder when no value selected', () => {
    const trigger = fixture.debugElement.query(By.css('.fuse-select__value'));
    expect(trigger.nativeElement.classList).toContain('fuse-select__value--placeholder');
  });

  it('does not render label by default', () => {
    expect(fixture.debugElement.query(By.css('.fuse-select__label'))).toBeNull();
  });

  it('renders label when label input is set', () => {
    fixture.componentRef.setInput('label', 'Country');
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.fuse-select__label')).nativeElement.textContent.trim()
    ).toBe('Country');
  });

  // ─── @Input defaults ─────────────────────────────────────────────────────────

  it('defaults size to md', () => expect(component.size()).toBe('md'));
  it('defaults multiple to false', () => expect(component.multiple()).toBe(false));
  it('defaults searchable to false', () => expect(component.searchable()).toBe(false));
  it('defaults disabled to false', () => expect(component.disabled()).toBe(false));

  it('adds fuse-select--error class when hasError=true', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.fuse-select--error'))).toBeTruthy();
  });

  // ─── Open / Close ────────────────────────────────────────────────────────────

  it('panel is closed by default', () => {
    expect(component.isOpen()).toBe(false);
    expect(overlayEl.querySelector('.fuse-select__panel')).toBeNull();
  });

  it('open() opens the panel', () => {
    component.open();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
    expect(overlayEl.querySelector('.fuse-select__panel')).toBeTruthy();
  });

  it('close() closes the panel', () => {
    component.open();
    fixture.detectChanges();
    component.close();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
    expect(overlayEl.querySelector('.fuse-select__panel')).toBeNull();
  });

  it('toggleOpen() opens a closed panel', () => {
    component.toggleOpen();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('toggleOpen() closes an open panel', () => {
    component.open();
    fixture.detectChanges();
    component.toggleOpen();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });

  it('clicking the trigger opens the panel', () => {
    fixture.debugElement.query(By.css('.fuse-select__trigger')).triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('open() does nothing when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.open();
    expect(component.isOpen()).toBe(false);
  });

  // ─── Size classes ────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)('adds fuse-select--%s class for size=%s', (size) => {
    fixture.componentRef.setInput('size', size);
    fixture.detectChanges();
    if (size !== 'md') {
      expect(fixture.debugElement.query(By.css(`.fuse-select--${size}`))).toBeTruthy();
    } else {
      // md has no explicit class; check no sm/lg
      expect(fixture.debugElement.query(By.css('.fuse-select--sm'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.fuse-select--lg'))).toBeNull();
    }
  });

  // ─── filteredOptions ──────────────────────────────────────────────────────────

  it('filteredOptions returns all options when filterText is empty', () => {
    expect(component['filteredOptions']()).toHaveLength(OPTIONS.length);
  });

  it('filteredOptions filters by label (case-insensitive)', () => {
    component['filterText'].set('al');
    expect(component['filteredOptions']().map(o => o.value)).toEqual(['a']);
  });

  it('filteredOptions returns empty array when nothing matches', () => {
    component['filterText'].set('zzz');
    expect(component['filteredOptions']()).toHaveLength(0);
  });

  // ─── Option rendering ────────────────────────────────────────────────────────

  it('renders options in the panel', () => {
    component.open();
    fixture.detectChanges();
    const opts = overlayEl.querySelectorAll('.fuse-select__option');
    expect(opts).toHaveLength(OPTIONS.length);
  });

  it('disabled option has disabled attribute', () => {
    component.open();
    fixture.detectChanges();
    const opts = overlayEl.querySelectorAll('.fuse-select__option');
    // Option at index 2 is disabled
    expect((opts[2] as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows empty state when filter yields no results', () => {
    component.open();
    component['filterText'].set('zzz');
    fixture.detectChanges();
    expect(overlayEl.querySelector('.fuse-select__empty')).toBeTruthy();
  });

  // ─── Single selection ─────────────────────────────────────────────────────────

  it('selectOption() selects a value and closes the panel', () => {
    component.open();
    fixture.detectChanges();
    component.selectOption(OPTIONS[0]);
    fixture.detectChanges();
    expect(component['_value']()).toBe('a');
    expect(component.isOpen()).toBe(false);
  });

  it('selectOption() does nothing for disabled options', () => {
    const spy = jest.fn();
    component.registerOnChange(spy);
    component.selectOption(OPTIONS[2]); // disabled
    expect(spy).not.toHaveBeenCalled();
    expect(component['_value']()).toBeNull();
  });

  it('selectionChange emits the selected value', () => {
    const spy = jest.fn();
    component.selectionChange.subscribe(spy);
    component.selectOption(OPTIONS[1]);
    expect(spy).toHaveBeenCalledWith('b');
  });

  it('onChange is called with selected value', () => {
    const spy = jest.fn();
    component.registerOnChange(spy);
    component.selectOption(OPTIONS[0]);
    expect(spy).toHaveBeenCalledWith('a');
  });

  // ─── isSelected ──────────────────────────────────────────────────────────────

  it('isSelected returns false when nothing selected', () => {
    expect(component.isSelected(OPTIONS[0])).toBe(false);
  });

  it('isSelected returns true for the selected option', () => {
    component['_value'].set('a');
    expect(component.isSelected(OPTIONS[0])).toBe(true);
    expect(component.isSelected(OPTIONS[1])).toBe(false);
  });

  // ─── displayLabel / hasValue ──────────────────────────────────────────────────

  it('hasValue is false with null value', () => {
    expect(component['hasValue']()).toBe(false);
  });

  it('hasValue is true after selection', () => {
    component['_value'].set('a');
    expect(component['hasValue']()).toBe(true);
  });

  it('displayLabel returns selected option label', () => {
    component['_value'].set('b');
    expect(component['displayLabel']()).toBe('Beta');
  });

  it('displayLabel returns empty string when nothing selected', () => {
    expect(component['displayLabel']()).toBe('');
  });

  // ─── Multiple selection ───────────────────────────────────────────────────────

  it('multiple mode: selectOption adds value to array', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    component['_value'].set([]);
    component.selectOption(OPTIONS[0]);
    expect(component['_value']()).toEqual(['a']);
  });

  it('multiple mode: selectOption toggles (removes) already-selected value', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    component['_value'].set(['a', 'b']);
    component.selectOption(OPTIONS[0]);
    expect(component['_value']()).toEqual(['b']);
  });

  it('multiple mode: panel stays open after selection', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    component.open();
    fixture.detectChanges();
    component.selectOption(OPTIONS[0]);
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('multiple mode: isSelected works for array values', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    component['_value'].set(['a', 'c']);
    expect(component.isSelected(OPTIONS[0])).toBe(true);
    expect(component.isSelected(OPTIONS[1])).toBe(false);
  });

  it('multiple mode: hasValue is false for empty array', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    component['_value'].set([]);
    expect(component['hasValue']()).toBe(false);
  });

  it('multiple mode: displayLabel joins labels with comma', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    component['_value'].set(['a', 'b']);
    expect(component['displayLabel']()).toBe('Alpha, Beta');
  });

  // ─── ControlValueAccessor ────────────────────────────────────────────────────

  it('writeValue sets internal signal', () => {
    component.writeValue('b');
    expect(component['_value']()).toBe('b');
  });

  it('writeValue with null sets null (single) or [] (multiple)', () => {
    component.writeValue(null);
    expect(component['_value']()).toBeNull();

    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    component.writeValue(null);
    expect(component['_value']()).toEqual([]);
  });

  it('setDisabledState(true) disables the trigger', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.fuse-select__trigger'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  it('setDisabledState(false) re-enables the trigger', () => {
    component.setDisabledState(true);
    component.setDisabledState(false);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.fuse-select__trigger'));
    expect(btn.nativeElement.disabled).toBe(false);
  });

  it('reactive form: syncs value from FormControl', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    hostFixture.componentInstance.ctrl.setValue('b');
    hostFixture.detectChanges();
    const sel = hostFixture.debugElement.query(By.directive(FuseSelectComponent));
    const selComp = sel.componentInstance as FuseSelectComponent;
    expect(selComp['_value']()).toBe('b');
  });

  it('reactive form: disables select when FormControl is disabled', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    hostFixture.componentInstance.ctrl.disable();
    hostFixture.detectChanges();
    const btn = hostFixture.debugElement.query(By.css('.fuse-select__trigger'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  // ─── Keyboard navigation ─────────────────────────────────────────────────────

  it('Enter key opens the panel when closed', () => {
    component.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('Space key opens the panel when closed', () => {
    component.handleKeydown(new KeyboardEvent('keydown', { key: ' ' }));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('Escape key closes the panel', () => {
    component.open();
    fixture.detectChanges();
    component.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });

  it('ArrowDown increments highlightedIndex', () => {
    component.open();
    fixture.detectChanges();
    expect(component['highlightedIndex']()).toBe(-1);
    component.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(component['highlightedIndex']()).toBe(0);
    component.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(component['highlightedIndex']()).toBe(1);
  });

  it('ArrowDown does not exceed last index', () => {
    component.open();
    fixture.detectChanges();
    for (let i = 0; i < 10; i++) {
      component.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    }
    expect(component['highlightedIndex']()).toBe(OPTIONS.length - 1);
  });

  it('ArrowUp decrements highlightedIndex', () => {
    component.open();
    component['highlightedIndex'].set(3);
    fixture.detectChanges();
    component.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(component['highlightedIndex']()).toBe(2);
  });

  it('ArrowUp does not go below 0', () => {
    component.open();
    fixture.detectChanges();
    component.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(component['highlightedIndex']()).toBe(0);
  });

  it('Enter selects the highlighted option', () => {
    component.open();
    component['highlightedIndex'].set(1);
    fixture.detectChanges();
    component.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(component['_value']()).toBe('b');
  });

  it('Tab closes the panel', () => {
    component.open();
    fixture.detectChanges();
    component.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });
});
