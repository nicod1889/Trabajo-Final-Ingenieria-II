import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteRequest, ClienteResponse } from '../interfaces/model.interfaces';
import { CustomPage, PageParams } from '../interfaces/components.interface';
import { GenericService } from './generic-service.class';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericService<ClienteRequest, ClienteResponse>{
  url: string = `${this.baseUrl}/clientes`;

  constructor(private httpClient: HttpClient) {
    super();
  }

  getAll() : Observable<ClienteResponse []>{
    return this.httpClient.get<ClienteResponse []>(`${this.url}/all`);
  }

  getById(id: number) : Observable<ClienteResponse>{
    return this.httpClient.get<ClienteResponse>(`${this.url}/${id}`);
  }

  deleteById(id: number) : Observable<any>{
    return this.httpClient.delete<any>(`${this.url}/${id}`);
  }

  update(id: number, request: ClienteRequest) : Observable<ClienteResponse>{
    return this.httpClient.put<any>(`${this.url}/${id}`, request);
  }

  create(request: ClienteRequest) : Observable<ClienteResponse>{
    return this.httpClient.post<any>(this.url, request);
  }

  getByPage(params: PageParams): Observable<CustomPage<ClienteResponse>> {
    const httpParams = this.createHttpParams(params);
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }
}
