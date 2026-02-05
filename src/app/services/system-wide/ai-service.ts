import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AiService {
    private apiUrl = environment.api;
  private http = inject(HttpClient);

  askAi(prompt: string) {
    return this.http.post(`${this.apiUrl}/ai`, { prompt });
  }

  askAiWithJsonContext(prompt: string, context: Record<string, any>) {
    return this.http.post(`${this.apiUrl}/ai`, { prompt, context }); 
  }
}
