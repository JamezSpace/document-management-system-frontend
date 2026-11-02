import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IdentityApi } from '../../../api/identity/identity.api';
import type { IdentityMeDto } from '../../../api/identity/identity-self-service.contracts';
import { AppContextService } from './app-context.service';

describe('AppContextService', () => {
  const identity: IdentityMeDto = {
    profile: {
      firstName: 'James',
      middleName: null,
      lastName: 'Okafor',
      email: 'james@example.com',
      phoneNumber: '+2348012345678',
      profilePictureUrl: 'https://example.com/profile.webp',
      signature: { present: true, updatedAt: '2026-11-01T10:00:00Z' },
    },
    employment: {
      id: 'STAFF-1',
      identityId: 'IDENTITY-1',
      staffNumber: 42,
      employmentType: 'permanent',
      unit: { id: 'UNIT-1', name: 'Registry', sector: 'Administration' },
      office: { id: 'OFFICE-1', name: 'Records', workbench: 'records' },
      designation: { id: 'DES-1', title: 'Records Officer' },
      status: 'active',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: null,
    },
    authority: { roles: [], capabilities: [], roleAssignments: [], capabilityScopes: {} },
    governance: { policy: { key: 'nexusfons_identity_governance', version: 1 }, fields: {} },
    pendingChangeRequests: [],
    revision: 7,
  };

  it('bootstraps the existing actor model from GET /identity/me without exposing a signature URL', async () => {
    const getMe = jasmine.createSpy().and.returnValue(
      of(
        new HttpResponse({
          body: { success: true as const, data: identity },
          headers: new HttpHeaders({ ETag: '"profile-7"' }),
        }),
      ),
    );
    TestBed.configureTestingModule({ providers: [{ provide: IdentityApi, useValue: { getMe } }] });

    const actor = await TestBed.inject(AppContextService).load();

    expect(getMe).toHaveBeenCalled();
    expect(actor.fullName).toBe('James Okafor');
    expect(actor.media.profilePicUrl).toBe(identity.profile.profilePictureUrl);
    expect(actor.media.signatureUrl).toBeNull();
    expect(actor.office.workbench).toBe('records');
  });
});
