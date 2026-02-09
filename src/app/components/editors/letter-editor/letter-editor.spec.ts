import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterEditor } from './letter-editor';

describe('LetterEditor', () => {
  let component: LetterEditor;
  let fixture: ComponentFixture<LetterEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LetterEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
