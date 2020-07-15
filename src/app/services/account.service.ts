import { UsersAndLinkedUsers } from './../model/user-and-linked-users';
import { LocalstorageService } from './localstorage.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Register } from '../model/register';
import { catchError, map } from 'rxjs/operators';
import { Login } from '../model/login';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenGetter } from '../helper/jwt-getter';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private isTokenExpired$ = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private jwtService: JwtHelperService,
    private localStoreageService: LocalstorageService,

  ) { }

  private baseUrl = environment.baseUrl;
  register(registerDto: Register) {

    return this.http.post<any>(`${this.baseUrl}/account/register`, registerDto)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(loginDto: Login): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/account/login`, loginDto)
      .pipe(
        map(response => {
          if (response.hasOwnProperty('accesToken')) {
            // tslint:disable-next-line:no-string-literal
            this.localStoreageService.save('access_token', response['accesToken']);
            this.isLoggedIn$.next(true);
            return true;
          }
        }),
        catchError(this.handleError)
      );
  }

  getUser(id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/json', // in Angular 7 : content type by default is application/json
        Authorization: 'Bearer ' + this.localStoreageService.getToken()
      })
    };
    return this.http.get<UsersAndLinkedUsers>(`${this.baseUrl}/account/user/${id}`, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  decodetokenGetUserId() {
    const token = this.localStoreageService.getToken();
    const tokenDecoded = this.jwtService.decodeToken(token);
    // tslint:disable-next-line:no-string-literal
    return tokenDecoded.Id;
  }

  logOut() {
    this.localStoreageService.remove('access_token');
    this.isLoggedIn$.next(false);
  }

  currentUser() {
    if (this.isUserLoggedIn()) {
      const token = this.localStoreageService.getToken();
      const decodedToken = this.jwtService.decodeToken(token);

      return decodedToken.email;
    }
    return null;
  }

  isUserLoggedIn(): boolean {
    return this.jwtService.tokenGetter() !== null && !this.jwtService.isTokenExpired();
  }

  isTokenExpired(): Observable<boolean> {
    const res = this.isTokenExpired$.next(this.jwtService.isTokenExpired());
    return this.isTokenExpired$.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
