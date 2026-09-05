import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { WorkItemsService } from '../../../../features/work-management/services/work-items/work-items-service';

import { ProcessingOverview } from './processing-overview';

describe('ProcessingOverview', () => {
  let component: ProcessingOverview;
  let fixture: ComponentFixture<ProcessingOverview>;
  let loadDetail: jasmine.Spy;

  beforeEach(async () => {
    loadDetail = jasmine.createSpy('loadDetail');

    await TestBed.configureTestingModule({
      imports: [ProcessingOverview],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                screen: 'escalated',
                title: 'Escalated items',
                description: 'Resolve breached and high-attention work.',
              },
            },
          },
        },
        {
          provide: WorkItemsService,
          useValue: { selectedItem: signal(null), loadDetail },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the route-owned Processing screen', () => {
    expect(component.screen()).toBe('escalated');
    expect(fixture.nativeElement.textContent).toContain('Escalated work requires prompt accountable action');
  });

  it('loads authoritative details for the selected assignment', () => {
    component.selectItem('21d409ba');

    expect(loadDetail).toHaveBeenCalledOnceWith('21d409ba');
  });
});
