import { Injectable } from '@angular/core';
import { GenericService } from './generic-service.class';
import { Observable } from 'rxjs';
import { PageParams, CustomPage } from '../interfaces/components.interface';
import { HttpClient } from '@angular/common/http';
import { ServiceRequest, ServiceResponse, ViajeRequest, ViajeResponse } from '../interfaces/model.interfaces';


@Injectable({
  providedIn: 'root'
})
export class ViajeService extends GenericService <ViajeRequest, ViajeResponse>{
  url: string = `${this.baseUrl}/viajes`;
  
  constructor(private httpClient: HttpClient) {
    super();
  }

  getAll() : Observable<ViajeResponse[]> {
    return this.httpClient.get<ViajeResponse []>( `${this.url}/all`);
  }
  getById(id: number): Observable<ViajeResponse> {
    return this.httpClient.get<ViajeResponse>( `${this.url}/${id}`);
  }
  deleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }
  update(id: number, request: ViajeRequest): Observable<ViajeResponse> {
    return this.httpClient.put<ViajeResponse>(`${this.url}/${id}`, request);
  }
  create(request: ViajeRequest): Observable<ViajeResponse> {
    return this.httpClient.post<any>(this.url, request)
  }
  getByPage(params: PageParams): Observable<CustomPage<ViajeResponse>> {
    const httpParams = this.createHttpParams(params);
    return this.httpClient.get<any>(this.url, { params: httpParams});
  }

}
