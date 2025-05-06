import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/enviroments';
import { employeeLogin } from '../interfaces/model.interfaces';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = `${environment.apiUrl}/auth`;

  currentemployeeLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentemployeeData: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private httpClient: HttpClient, private router : Router) { 
    this.currentemployeeLoginOn = new BehaviorSubject<boolean>(sessionStorage.getItem("token") != null);
    const token = sessionStorage.getItem("token");
    if (token) {
      this.currentemployeeData.next(token);
    }
  }

  login(credentials: employeeLogin): Observable<any> {
    return this.httpClient.post<any>(this.url + "/login", credentials).pipe(
      tap((employeeData) => {
        sessionStorage.setItem("token", employeeData.token);
        this.currentemployeeData.next(employeeData.token);
        this.currentemployeeLoginOn.next(true);
      }),
      map((employeeData) => employeeData.token),
      catchError(this.handleError)
    );
  }

  logout() {
    sessionStorage.removeItem("token");
    this.currentemployeeLoginOn.next(false);
    this.currentemployeeData.next("");
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Error del lado del Cliente o de red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
    }
    // Aquí podemos también devolver el objeto de error original para su manejo más detallado
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private decodeToken(token: string) {
    try {
      return jwtDecode<string>(token);
    } catch (Error) {
      console.error('Error decodificando token', Error);
      return null;
    }
  }

  get employeeToken() {
    return this.currentemployeeData.value;
  }

  get employeeData() {
    if(this.currentemployeeData.value){
      return jwtDecode(this.currentemployeeData.value);
    } else{
      return null;
    }
  }
}