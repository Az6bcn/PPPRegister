import { Injectable } from '@angular/core';
import { IRegistrant } from '../model/registrant';
import { Slots } from '../model/slots-available';
import { environment } from './../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private localStoreageService: LocalstorageService) { }

  private httpOptions = {
    headers: new HttpHeaders({
      // 'Content-Type':  'application/json', // in Angular 7 : content type by default is application/json
      Authorization: 'Bearer ' + this.localStoreageService.getToken()
    })
  };

  /**
   * Checks-in a user
   * @param data
   */
  createRegistration(data: IRegistrant) {
    const url = `${this.baseUrl}/booking`;
    return this.http.post<any>(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gets slots available for service on that time
   * @param date
   */
  getSlotsAvailable(date: string): Observable<Array<Slots>> {
    const url = `${this.baseUrl}/booking/${date}`;
    return this.http.get<Array<Slots>>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  findActiveBooking(userId: string, date: string) {
    const url = `${this.baseUrl}/booking/user/${userId}/${date}`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return throwError('Your session has expired, please login to continue');
      }
      if (error.status === 400) {
        return throwError(error);
      }
    }
    // return an observable with a user-facing error message
    return throwError(
      `Something bad happened: ${error.error}`);
  }
}
