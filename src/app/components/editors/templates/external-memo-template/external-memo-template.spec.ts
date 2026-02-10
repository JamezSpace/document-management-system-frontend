import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalMemoTemplate } from './external-memo-template';

describe('ExternalMemoTemplate', () => {
  let component: ExternalMemoTemplate;
  let fixture: ComponentFixture<ExternalMemoTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalMemoTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalMemoTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
