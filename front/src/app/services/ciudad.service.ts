import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PageParams, CustomPage } from "../interfaces/components.interface";
import { CiudadRequest, CiudadResponse } from "../interfaces/model.interfaces";
import { GenericService } from "./generic-service.class";

@Injectable({
    providedIn: 'root'
  })
  export class CiudadService extends GenericService<CiudadRequest, CiudadResponse>{
    url: string = `${this.baseUrl}/ciudades`;
  
    constructor(private httpClient: HttpClient) {
      super();
    }
  
    getAll() : Observable<CiudadResponse []>{
      return this.httpClient.get<CiudadResponse []>(`${this.url}/all`);
    }
  
    getById(id: number) : Observable<CiudadResponse>{
      return this.httpClient.get<CiudadResponse>(`${this.url}/${id}`);
    }
  
    deleteById(id: number) : Observable<any>{
      return this.httpClient.delete<any>(`${this.url}/${id}`);
    }
  
    update(id: number, request: CiudadRequest) : Observable<CiudadResponse>{
      return this.httpClient.put<any>(`${this.url}/${id}`, request);
    }
  
    create(request: CiudadRequest) : Observable<CiudadResponse>{
      return this.httpClient.post<any>(this.url, request);
    }
  
    getByPage(params: PageParams): Observable<CustomPage<CiudadResponse>> {
      const httpParams = this.createHttpParams(params);
      return this.httpClient.get<any>(this.url, { params: httpParams });
    }
  }