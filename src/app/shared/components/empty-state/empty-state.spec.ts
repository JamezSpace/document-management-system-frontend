import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  let component: EmptyState;
  let fixture: ComponentFixture<EmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyState);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('state', {
      kind: 'no-data',
      iconName: 'lucideInbox',
      title: 'Nothing here',
      description: 'New items will appear here.',
      actions: [{ id: 'refresh', label: 'Refresh' }],
    });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits configured action identifiers', () => {
    spyOn(component.actionSelected, 'emit');

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(component.actionSelected.emit).toHaveBeenCalledWith('refresh');
  });
});
