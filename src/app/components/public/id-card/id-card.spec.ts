import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdCard } from './id-card';

describe('IdCard', () => {
  let component: IdCard;
  let fixture: ComponentFixture<IdCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
