import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FuseCheckboxComponent } from '../checkbox/fuse-checkbox.component';
import { FuseCheckboxGroupComponent } from './fuse-checkbox-group.component';

// ─── Host wrapper for ContentChildren ────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseCheckboxGroupComponent, FuseCheckboxComponent, ReactiveFormsModule],
  template: `
    <fuse-checkbox-group [formControl]="ctrl">
      <fuse-checkbox value="apple" label="Apple"></fuse-checkbox>
      <fuse-checkbox value="banana" label="Banana"></fuse-checkbox>
      <fuse-checkbox value="cherry" label="Cherry"></fuse-checkbox>
    </fuse-checkbox-group>
  `,
})
class GroupFormHost {
  ctrl = new FormControl<string[]>([]);
}

@Component({
  standalone: true,
  imports: [FuseCheckboxGroupComponent, FuseCheckboxComponent],
  template: `
    <fuse-checkbox-group>
      <fuse-checkbox value="a" label="A"></fuse-checkbox>
      <fuse-checkbox value="b" label="B"></fuse-checkbox>
    </fuse-checkbox-group>
  `,
})
class GroupBasicHost {}

describe('FuseCheckboxGroupComponent', () => {
  describe('basic rendering', () => {
    let fixture: ComponentFixture<GroupBasicHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GroupBasicHost],
      }).compileComponents();
      fixture = TestBed.createComponent(GroupBasicHost);
      fixture.detectChanges();
    });

    it('renders the group container', () => {
      expect(fixture.nativeElement.querySelector('.fuse-checkbox-group')).toBeTruthy();
    });

    it('applies vertical class by default', () => {
      expect(fixture.nativeElement.querySelector('.fuse-checkbox-group--vertical')).toBeTruthy();
    });

    it('renders all child checkboxes', () => {
      const checkboxes = fixture.nativeElement.querySelectorAll('fuse-checkbox');
      expect(checkboxes.length).toBe(2);
    });
  });

  describe('orientation input', () => {
    @Component({
      standalone: true,
      imports: [FuseCheckboxGroupComponent, FuseCheckboxComponent],
      template: `
        <fuse-checkbox-group orientation="horizontal">
          <fuse-checkbox value="a"></fuse-checkbox>
        </fuse-checkbox-group>
      `,
    })
    class HorizontalHost {}

    it('applies horizontal class', async () => {
      await TestBed.configureTestingModule({ imports: [HorizontalHost] }).compileComponents();
      const f = TestBed.createComponent(HorizontalHost);
      f.detectChanges();
      expect(f.nativeElement.querySelector('.fuse-checkbox-group--horizontal')).toBeTruthy();
    });
  });

  describe('with FormControl', () => {
    let fixture: ComponentFixture<GroupFormHost>;
    let host: GroupFormHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GroupFormHost],
      }).compileComponents();
      fixture = TestBed.createComponent(GroupFormHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('all checkboxes start unchecked with empty array', () => {
      const checked = fixture.nativeElement.querySelectorAll('.fuse-checkbox--checked');
      expect(checked.length).toBe(0);
    });

    it('checks the matching checkbox when FormControl is set', () => {
      host.ctrl.setValue(['apple']);
      fixture.detectChanges();
      const checked = fixture.nativeElement.querySelectorAll('.fuse-checkbox--checked');
      expect(checked.length).toBe(1);
    });

    it('checks multiple checkboxes', () => {
      host.ctrl.setValue(['apple', 'cherry']);
      fixture.detectChanges();
      const checked = fixture.nativeElement.querySelectorAll('.fuse-checkbox--checked');
      expect(checked.length).toBe(2);
    });

    it('updates FormControl when user clicks a checkbox', () => {
      const inputs = fixture.nativeElement.querySelectorAll('.fuse-checkbox__native') as NodeListOf<HTMLInputElement>;
      inputs[0].checked = true;
      inputs[0].dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(host.ctrl.value).toContain('apple');
    });

    it('removes value from FormControl when user unchecks', () => {
      host.ctrl.setValue(['apple', 'banana']);
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll('.fuse-checkbox__native') as NodeListOf<HTMLInputElement>;
      inputs[0].checked = false;
      inputs[0].dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(host.ctrl.value).not.toContain('apple');
      expect(host.ctrl.value).toContain('banana');
    });

    it('disables all children when FormControl.disable() is called', () => {
      host.ctrl.disable();
      fixture.detectChanges();
      const disabledBoxes = fixture.nativeElement.querySelectorAll('.fuse-checkbox--disabled');
      expect(disabledBoxes.length).toBe(3);
    });
  });
});
