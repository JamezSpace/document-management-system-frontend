import { HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../client/api-client';
import type { WorkspaceDto } from './workspace.contracts';

@Injectable({ providedIn: 'root' })
export class WorkspaceApi {
  private readonly api = inject(ApiClient);

  get(documentId: string, context?: HttpContext, canvas: 'internal' | 'letterhead' = 'internal') {
    return this.api.getResponse<WorkspaceDto>(`workspace/${documentId}`, {
      context,
      params: { canvas },
    });
  }
}
