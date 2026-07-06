import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoBodyEditor } from './memo-body-editor';

describe('MemoBodyEditor', () => {
  let component: MemoBodyEditor;
  let fixture: ComponentFixture<MemoBodyEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoBodyEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoBodyEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
