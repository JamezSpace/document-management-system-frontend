import { HttpClient, HttpContext, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../../models/api/ApiResponse.api';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.api.replace(/\/$/, '');

  get<T>(
    path: string,
    context?: HttpContext,
    params?: Record<string, string | number | boolean>,
  ): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.url(path), { context, params });
  }

  post<T>(path: string, body: unknown = {}, context?: HttpContext): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.url(path), body, { context });
  }

  patch<T>(
    path: string,
    body: unknown,
    context?: HttpContext,
    headers?: HttpHeaders | Record<string, string>,
  ): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(this.url(path), body, { context, headers });
  }

  delete<T>(path: string, context?: HttpContext): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.url(path), { context });
  }

  getResponse<T>(
    path: string,
    options: {
      context?: HttpContext;
      params?: Record<string, string | number | boolean>;
    } = {},
  ): Observable<HttpResponse<ApiResponse<T>>> {
    return this.http.get<ApiResponse<T>>(this.url(path), {
      ...options,
      observe: 'response',
    });
  }

  postResponse<T>(
    path: string,
    body: unknown,
    options: { context?: HttpContext; headers?: HttpHeaders | Record<string, string> } = {},
  ): Observable<HttpResponse<ApiResponse<T>>> {
    return this.http.post<ApiResponse<T>>(this.url(path), body, {
      ...options,
      observe: 'response',
    });
  }

  deleteResponse<T>(
    path: string,
    body: unknown,
    options: { context?: HttpContext; headers?: HttpHeaders | Record<string, string> } = {},
  ): Observable<HttpResponse<ApiResponse<T>>> {
    return this.http.request<ApiResponse<T>>('DELETE', this.url(path), {
      ...options,
      body,
      observe: 'response',
    });
  }

  postBlobResponse(
    path: string,
    body: unknown,
    options: { context?: HttpContext; headers?: HttpHeaders | Record<string, string> } = {},
  ): Observable<HttpResponse<Blob>> {
    return this.http.post(this.url(path), body, {
      ...options,
      observe: 'response',
      responseType: 'blob',
    });
  }

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }
}
