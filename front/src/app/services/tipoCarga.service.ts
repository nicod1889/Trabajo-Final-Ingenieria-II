import { Injectable } from "@angular/core";
import { TipoCargaRequest, TipoCargaResponse } from "../interfaces/model.interfaces";
import { GenericService } from "./generic-service.class";
import { Observable } from "rxjs";
import { PageParams, CustomPage } from "../interfaces/components.interface";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class TipoCargaService extends GenericService<TipoCargaRequest, TipoCargaResponse>{

    url: string = `${this.baseUrl}/tipo_cargas`;

    constructor(private httpClient: HttpClient){
        super();
    }

    getAll(): Observable<TipoCargaResponse[]> {
        return this.httpClient.get<TipoCargaResponse[]>(`${this.url}/all`);
    }
    getById(id: number): Observable<TipoCargaResponse> {
        return this.httpClient.get<TipoCargaResponse>(`${this.url}/${id}`);
    }
    deleteById(id: number): Observable<any> {
        return this.httpClient.delete<any>(`${this.url}/${id}`);
    }
    update(id: number, request: TipoCargaRequest): Observable<TipoCargaResponse> {
        return this.httpClient.put<TipoCargaResponse>(`${this.url}/${id}`, request);
    }
    create(request: TipoCargaRequest): Observable<TipoCargaResponse> {
        return this.httpClient.post<TipoCargaResponse>(this.url, request);
    }
    getByPage(params: PageParams): Observable<CustomPage<TipoCargaResponse>> {
        const httpParams = this.createHttpParams(params);
        return this.httpClient.get<any>(this.url, { params: httpParams });
    }
    
}