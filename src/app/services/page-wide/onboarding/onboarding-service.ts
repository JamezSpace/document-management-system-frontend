import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { EntityRequest } from '../../../interfaces/onboarding/entities/Entity.api';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
    constructor(private httpClient: HttpClient) {}

    loading = signal<boolean>(false)

    async getEntityDetails(entity: EntityRequest) {
        return this.httpClient.get(`${environment.api}/${entity.type}/${entity.id}`)
    }
}
