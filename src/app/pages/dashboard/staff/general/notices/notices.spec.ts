import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficeContextService } from '../../../../../office-platform/context/office-context.service';

import { Notices } from './notices';

describe('Notices', () => {
  let component: Notices;
  let fixture: ComponentFixture<Notices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notices],
      providers: [
        {
          provide: OfficeContextService,
          useValue: { route: (...segments: string[]) => `/office/processing/${segments.join('/')}` },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
