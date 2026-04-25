import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitesListView } from './invites-list-view';

describe('InvitesListView', () => {
  let component: InvitesListView;
  let fixture: ComponentFixture<InvitesListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitesListView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitesListView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
