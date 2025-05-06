import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpleadoRequest, EmpleadoResponse } from '../interfaces/model.interfaces';
import { GenericService } from './generic-service.class';
import { PageParams, CustomPage } from '../interfaces/components.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService extends GenericService<EmpleadoRequest, EmpleadoResponse>{
  url: string = `${this.baseUrl}/empleados`;

  constructor(private httpClient: HttpClient) {
    super();
  }

  create(request: EmpleadoRequest) : Observable<EmpleadoResponse>{
    return this.httpClient.post<any>(this.url, request);
  }

  update(id: number, request: EmpleadoRequest) : Observable<EmpleadoResponse>{
    return this.httpClient.put<any>(`${this.url}/${id}`, request);
  }

  getAll() : Observable<EmpleadoResponse []>{
    return this.httpClient.get<EmpleadoResponse []>(`${this.url}/all`);
  }

  getById(id: number) : Observable<EmpleadoResponse>{
    return this.httpClient.get<EmpleadoResponse>(`${this.url}/${id}`);
  }

  deleteById(id: number) : Observable<void>{
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

  getByPage(params: PageParams): Observable<CustomPage<EmpleadoResponse>> {
    const httpParams = this.createHttpParams(params);
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }
}
