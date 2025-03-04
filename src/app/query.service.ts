import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  constructor(private httpClient: HttpClient) {} // Simplificado: inyección directa con modificador private

  async search(url: string): Promise<any> { // Corregido "seach" a "search"
    return await this.httpClient.get<any>(`${url}?f=pjson`).toPromise(); // Agregado return
  }
}
