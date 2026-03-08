import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifToast } from './notif-toast';

describe('NotifToast', () => {
  let component: NotifToast;
  let fixture: ComponentFixture<NotifToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifToast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifToast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
