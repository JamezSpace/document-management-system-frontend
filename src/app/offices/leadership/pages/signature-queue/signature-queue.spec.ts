import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignatureQueue } from './signature-queue';

describe('SignatureQueue', () => {
  let fixture: ComponentFixture<SignatureQueue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SignatureQueue] }).compileComponents();
    fixture = TestBed.createComponent(SignatureQueue);
    fixture.detectChanges();
  });

  it('shows the exact selected version and policy effect', () => {
    expect(fixture.nativeElement.textContent).toContain('Governance and signature');
    expect(fixture.nativeElement.textContent).toContain('v4 · hash verified');
  });
});
