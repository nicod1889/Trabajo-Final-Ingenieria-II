import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CamionRequest, CamionResponse } from '../interfaces/model.interfaces';
import { CustomPage, PageParams } from '../interfaces/components.interface';
import { GenericService } from './generic-service.class';

@Injectable({
  providedIn: 'root'
})
export class CamionService extends GenericService<CamionRequest, CamionResponse>{
  url: string = `${this.baseUrl}/camiones`;

  constructor(private httpClient: HttpClient) {
    super();
  }

  getAll() : Observable<CamionResponse []>{
    return this.httpClient.get<CamionResponse []>(`${this.url}/all`);
  }

  getById(id: number) : Observable<CamionResponse>{
    return this.httpClient.get<CamionResponse>(`${this.url}/${id}`);
  }

  deleteById(id: number) : Observable<any>{
    return this.httpClient.delete<any>(`${this.url}/${id}`);
  }

  update(id: number, request: CamionRequest) : Observable<CamionResponse>{
    return this.httpClient.put<any>(`${this.url}/${id}`, request);
  }

  create(request: CamionRequest) : Observable<CamionResponse>{
    return this.httpClient.post<any>(this.url, request);
  }

  getByPage(params: PageParams): Observable<CustomPage<CamionResponse>> {
    const httpParams = this.createHttpParams(params);
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }
}
