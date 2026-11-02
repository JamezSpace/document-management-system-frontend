import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IdentityApi } from './identity.api';

describe('IdentityApi', () => {
  let api: IdentityApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(IdentityApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the self-service identity as a full response so the ETag is retained', () => {
    api.getMe().subscribe((response) => expect(response.headers.get('ETag')).toBe('"profile-7"'));

    const request = http.expectOne((candidate) => candidate.url.endsWith('/identity/me'));
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: {} }, { headers: { ETag: '"profile-7"' } });
  });

  it('sends the current ETag when directly updating a profile', () => {
    api.updateProfile('"profile-7"', { phoneNumber: '+2348012345678' }).subscribe();

    const request = http.expectOne((candidate) => candidate.url.endsWith('/identity/me/profile'));
    expect(request.request.method).toBe('PATCH');
    expect(request.request.headers.get('If-Match')).toBe('"profile-7"');
    expect(request.request.body).toEqual({ phoneNumber: '+2348012345678' });
    request.flush({ success: true, data: {} });
  });

  it('uses the owned profilePicture multipart field', () => {
    const file = new File(['photo'], 'photo.webp', { type: 'image/webp' });
    api.updateProfilePicture('"profile-8"', file).subscribe();

    const request = http.expectOne((candidate) => candidate.url.endsWith('/identity/me/profile-picture'));
    expect(request.request.method).toBe('PUT');
    expect(request.request.headers.get('If-Match')).toBe('"profile-8"');
    expect((request.request.body as FormData).get('profilePicture')).toBe(file);
    request.flush({ success: true, data: {} });
  });

  it('uploads governed media without adding a public URL', () => {
    const file = new File(['evidence'], 'evidence.pdf', { type: 'application/pdf' });
    api.uploadChangeRequestMedia('evidence', file).subscribe();

    const request = http.expectOne((candidate) =>
      candidate.url.endsWith('/identity/me/change-request-media'),
    );
    const body = request.request.body as FormData;
    expect(body.get('purpose')).toBe('evidence');
    expect(body.get('file')).toBe(file);
    request.flush({ success: true, data: { mediaId: 'MEDIA-1' } });
  });
});
