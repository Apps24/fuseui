import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FuseRadioComponent } from './fuse-radio.component';
import { FuseRadioGroupComponent } from '../radio-group/fuse-radio-group.component';

// ─── FuseRadioComponent (inside group) ───────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseRadioGroupComponent, FuseRadioComponent, ReactiveFormsModule],
  template: `
    <fuse-radio-group [formControl]="ctrl">
      <fuse-radio value="red" label="Red"></fuse-radio>
      <fuse-radio value="green" label="Green"></fuse-radio>
      <fuse-radio value="blue" label="Blue"></fuse-radio>
    </fuse-radio-group>
  `,
})
class RadioGroupFormHost {
  ctrl = new FormControl<string | null>(null);
}

@Component({
  standalone: true,
  imports: [FuseRadioGroupComponent, FuseRadioComponent],
  template: `
    <fuse-radio-group>
      <fuse-radio value="x" label="X"></fuse-radio>
      <fuse-radio value="y" label="Y"></fuse-radio>
    </fuse-radio-group>
  `,
})
class RadioGroupBasicHost {}

describe('FuseRadioComponent', () => {
  describe('rendering inside a group', () => {
    let fixture: ComponentFixture<RadioGroupBasicHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RadioGroupBasicHost],
      }).compileComponents();
      fixture = TestBed.createComponent(RadioGroupBasicHost);
      fixture.detectChanges();
    });

    it('renders radio inputs', () => {
      const inputs = fixture.nativeElement.querySelectorAll('.fuse-radio__native');
      expect(inputs.length).toBe(2);
    });

    it('all radios start unchecked', () => {
      const checked = fixture.nativeElement.querySelectorAll('.fuse-radio--checked');
      expect(checked.length).toBe(0);
    });

    it('renders label text', () => {
      const labels = fixture.nativeElement.querySelectorAll('.fuse-radio__label');
      expect(labels[0].textContent.trim()).toBe('X');
      expect(labels[1].textContent.trim()).toBe('Y');
    });

    it('all radios share the same name attribute (from group)', () => {
      const inputs = fixture.nativeElement.querySelectorAll('.fuse-radio__native') as NodeListOf<HTMLInputElement>;
      expect(inputs[0].name).toBe(inputs[1].name);
      expect(inputs[0].name).toBeTruthy();
    });
  });

  describe('size classes', () => {
    @Component({
      standalone: true,
      imports: [FuseRadioGroupComponent, FuseRadioComponent],
      template: `
        <fuse-radio-group>
          <fuse-radio value="a" size="sm"></fuse-radio>
          <fuse-radio value="b" size="lg"></fuse-radio>
        </fuse-radio-group>
      `,
    })
    class SizedHost {}

    it('applies size classes to individual radios', async () => {
      await TestBed.configureTestingModule({ imports: [SizedHost] }).compileComponents();
      const f = TestBed.createComponent(SizedHost);
      f.detectChanges();
      const radios = f.nativeElement.querySelectorAll('.fuse-radio');
      expect(radios[0].classList).toContain('fuse-radio--sm');
      expect(radios[1].classList).toContain('fuse-radio--lg');
    });
  });
});

describe('FuseRadioGroupComponent', () => {
  describe('basic rendering', () => {
    let fixture: ComponentFixture<RadioGroupBasicHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RadioGroupBasicHost],
      }).compileComponents();
      fixture = TestBed.createComponent(RadioGroupBasicHost);
      fixture.detectChanges();
    });

    it('renders the group container with role=radiogroup', () => {
      const group = fixture.nativeElement.querySelector('.fuse-radio-group');
      expect(group).toBeTruthy();
      expect(group.getAttribute('role')).toBe('radiogroup');
    });

    it('applies vertical class by default', () => {
      expect(fixture.nativeElement.querySelector('.fuse-radio-group--vertical')).toBeTruthy();
    });
  });

  describe('orientation', () => {
    @Component({
      standalone: true,
      imports: [FuseRadioGroupComponent, FuseRadioComponent],
      template: `<fuse-radio-group orientation="horizontal"><fuse-radio value="a"></fuse-radio></fuse-radio-group>`,
    })
    class HorizHost {}

    it('applies horizontal class', async () => {
      await TestBed.configureTestingModule({ imports: [HorizHost] }).compileComponents();
      const f = TestBed.createComponent(HorizHost);
      f.detectChanges();
      expect(f.nativeElement.querySelector('.fuse-radio-group--horizontal')).toBeTruthy();
    });
  });

  describe('with FormControl', () => {
    let fixture: ComponentFixture<RadioGroupFormHost>;
    let host: RadioGroupFormHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RadioGroupFormHost],
      }).compileComponents();
      fixture = TestBed.createComponent(RadioGroupFormHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('no radio is checked when control is null', () => {
      expect(fixture.nativeElement.querySelectorAll('.fuse-radio--checked').length).toBe(0);
    });

    it('checks the matching radio when FormControl is set', () => {
      host.ctrl.setValue('green');
      fixture.detectChanges();
      const checked = fixture.nativeElement.querySelectorAll('.fuse-radio--checked');
      expect(checked.length).toBe(1);
    });

    it('updates FormControl when user clicks a radio', () => {
      const inputs = fixture.nativeElement.querySelectorAll('.fuse-radio__native') as NodeListOf<HTMLInputElement>;
      inputs[1].dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(host.ctrl.value).toBe('green');
    });

    it('switches selection when a different radio is clicked', () => {
      host.ctrl.setValue('red');
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll('.fuse-radio__native') as NodeListOf<HTMLInputElement>;
      inputs[2].dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(host.ctrl.value).toBe('blue');
      const checked = fixture.nativeElement.querySelectorAll('.fuse-radio--checked');
      expect(checked.length).toBe(1);
    });

    it('disables all radios when FormControl.disable() is called', () => {
      host.ctrl.disable();
      fixture.detectChanges();
      const disabled = fixture.nativeElement.querySelectorAll('.fuse-radio--disabled');
      expect(disabled.length).toBe(3);
    });

    it('emits valueChange when selection changes', () => {
      const group = fixture.nativeElement.querySelector('fuse-radio-group');
      const emitted: any[] = [];
      // valueChange is on FuseRadioGroupComponent — get via debugElement
      const { debugElement } = fixture;
      const groupDebug = debugElement.query(el => el.name === 'fuse-radio-group');
      if (groupDebug) {
        (groupDebug.componentInstance as FuseRadioGroupComponent).valueChange.subscribe((v: any) => emitted.push(v));
      }

      const inputs = fixture.nativeElement.querySelectorAll('.fuse-radio__native') as NodeListOf<HTMLInputElement>;
      inputs[0].dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(emitted).toEqual(['red']);
    });
  });

  describe('disabled at group level', () => {
    @Component({
      standalone: true,
      imports: [FuseRadioGroupComponent, FuseRadioComponent],
      template: `
        <fuse-radio-group [disabled]="true">
          <fuse-radio value="a" label="A"></fuse-radio>
          <fuse-radio value="b" label="B"></fuse-radio>
        </fuse-radio-group>
      `,
    })
    class DisabledGroupHost {}

    it('disables all child radios', async () => {
      await TestBed.configureTestingModule({ imports: [DisabledGroupHost] }).compileComponents();
      const f = TestBed.createComponent(DisabledGroupHost);
      f.detectChanges();
      const disabled = f.nativeElement.querySelectorAll('.fuse-radio--disabled');
      expect(disabled.length).toBe(2);
    });
  });

  describe('valueChange @Output', () => {
    @Component({
      standalone: true,
      imports: [FuseRadioGroupComponent, FuseRadioComponent],
      template: `
        <fuse-radio-group (valueChange)="onValue($event)">
          <fuse-radio value="option1" label="Option 1"></fuse-radio>
          <fuse-radio value="option2" label="Option 2"></fuse-radio>
        </fuse-radio-group>
      `,
    })
    class ValueChangeHost {
      received: any[] = [];
      onValue(v: any) { this.received.push(v); }
    }

    it('emits the selected value via valueChange output', async () => {
      await TestBed.configureTestingModule({ imports: [ValueChangeHost] }).compileComponents();
      const f = TestBed.createComponent(ValueChangeHost);
      f.detectChanges();

      const inputs = f.nativeElement.querySelectorAll('.fuse-radio__native') as NodeListOf<HTMLInputElement>;
      inputs[0].dispatchEvent(new Event('change'));
      f.detectChanges();

      expect(f.componentInstance.received).toEqual(['option1']);
    });
  });
});
