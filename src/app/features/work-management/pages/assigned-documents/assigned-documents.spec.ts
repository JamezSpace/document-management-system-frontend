import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AssignedDocuments } from './assigned-documents';

describe('AssignedDocuments', () => {
  let component: AssignedDocuments;
  let fixture: ComponentFixture<AssignedDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedDocuments],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the assignment register and work actions', () => {
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Assigned documents');
    expect(text).toContain('Assigning authority');
    expect(text).toContain('Industrial attachment policy review');
    expect(text).toContain('Start work');
  });
});
