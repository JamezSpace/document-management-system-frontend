import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GenericDashboardService {
  loading = signal<boolean>(false);
}
