import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CargaRequest, CargaResponse } from '../interfaces/model.interfaces';
import { CustomPage, PageParams } from '../interfaces/components.interface';
import { GenericService } from './generic-service.class';

@Injectable({
  providedIn: 'root'
})
export class CargaService extends GenericService<CargaRequest, CargaResponse>{
  url: string = `${this.baseUrl}/cargas`;

  constructor(private httpClient: HttpClient) {
    super();
  }

  getAll() : Observable<CargaResponse []>{
    return this.httpClient.get<CargaResponse []>(`${this.url}/all`);
  }

  getById(id: number) : Observable<CargaResponse>{
    return this.httpClient.get<CargaResponse>(`${this.url}/${id}`);
  }

  deleteById(id: number) : Observable<any>{
    return this.httpClient.delete<any>(`${this.url}/${id}`);
  }

  update(id: number, request: CargaRequest) : Observable<CargaResponse>{
    return this.httpClient.put<any>(`${this.url}/${id}`, request);
  }

  create(request: CargaRequest) : Observable<CargaResponse>{
    return this.httpClient.post<any>(this.url, request);
  }

  getByPage(params: PageParams): Observable<CustomPage<CargaResponse>> {
    const httpParams = this.createHttpParams(params);
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }
}
