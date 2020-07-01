import { Injectable } from '@angular/core';
import { IRegistrant } from '../model/registrant';
import { Slots } from '../model/slots-available';
import { environment } from './../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Checks-in a user
   * @param data
   */
  createRegistration(data: IRegistrant) {
    const url = `${this.baseUrl}/registration`;
    return this.http.post<any>(url, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gets slots available for service on that time
   * @param date
   */
  getSlotsAvailable(date: string): Observable<Array<Slots>> {
    const url = `${this.baseUrl}/slotsavailable/${date}`;
    return this.http.get<Array<Slots>>(url)
      .pipe(
        catchError(this.handleError)
      );
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
