import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectiveDetail } from './directive-detail';

describe('DirectiveDetail', () => {
  let component: DirectiveDetail;
  let fixture: ComponentFixture<DirectiveDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectiveDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectiveDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
