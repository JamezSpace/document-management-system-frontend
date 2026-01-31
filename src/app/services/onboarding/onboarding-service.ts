import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { EntityRequest, EntityResponse } from '../../interfaces/onboarding/entities/Entity.api-model';
import { ApiResponse } from '../../interfaces/ApiResponse.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
    constructor(private httpClient: HttpClient) {}

    async getEntityDetails(entity: EntityRequest) {
        return this.httpClient.get(`${environment.api}/${entity.type}/${entity.id}`)
    }
}
