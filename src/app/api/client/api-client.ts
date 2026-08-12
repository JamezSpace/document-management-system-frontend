import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../../models/api/ApiResponse.api';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.api.replace(/\/$/, '');

  get<T>(path: string, context?: HttpContext): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.url(path), { context });
  }

  post<T>(path: string, body: unknown = {}, context?: HttpContext): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.url(path), body, { context });
  }

  patch<T>(path: string, body: unknown, context?: HttpContext): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(this.url(path), body, { context });
  }

  delete<T>(path: string, context?: HttpContext): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.url(path), { context });
  }

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }
}
