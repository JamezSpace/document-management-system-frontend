import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperControls } from './paper-controls';

describe('PaperControls', () => {
  let component: PaperControls;
  let fixture: ComponentFixture<PaperControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperControls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
