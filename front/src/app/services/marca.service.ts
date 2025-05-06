import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PageParams, CustomPage } from "../interfaces/components.interface";
import { MarcaRequest, MarcaResponse } from "../interfaces/model.interfaces";
import { GenericService } from "./generic-service.class";

@Injectable({
    providedIn: 'root'
  })
  export class MarcaService extends GenericService<MarcaRequest, MarcaResponse>{
    url: string = `${this.baseUrl}/marcas`;
  
    constructor(private httpClient: HttpClient) {
      super();
    }
  
    getAll() : Observable<MarcaResponse []>{
      return this.httpClient.get<MarcaResponse []>(`${this.url}/all`);
    }
  
    getById(id: number) : Observable<MarcaResponse>{
      return this.httpClient.get<MarcaResponse>(`${this.url}/${id}`);
    }
  
    deleteById(id: number) : Observable<any>{
      return this.httpClient.delete<any>(`${this.url}/${id}`);
    }
  
    update(id: number, request: MarcaRequest) : Observable<MarcaResponse>{
      return this.httpClient.put<any>(`${this.url}/${id}`, request);
    }
  
    create(request: MarcaRequest) : Observable<MarcaResponse>{
      return this.httpClient.post<any>(this.url, request);
    }
  
    getByPage(params: PageParams): Observable<CustomPage<MarcaResponse>> {
      const httpParams = this.createHttpParams(params);
      return this.httpClient.get<any>(this.url, { params: httpParams });
    }
  }