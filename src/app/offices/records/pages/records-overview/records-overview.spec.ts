import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RecordsOverview } from './records-overview';

describe('RecordsOverview', () => {
  let fixture: ComponentFixture<RecordsOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RecordsOverview], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(RecordsOverview);
    fixture.detectChanges();
  });

  it('renders registry control information only', () => {
    expect(fixture.nativeElement.textContent).toContain('Records & Registry');
    expect(fixture.nativeElement.textContent).toContain('Intake queue');
    expect(fixture.nativeElement.textContent).not.toContain('Capture source');
  });
});
