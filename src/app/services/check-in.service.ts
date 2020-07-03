import { SignInOut, SignInOutResponse } from './../model/sigin-in-out';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CheckIn } from '../model/check-in';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { CheckedinMember } from '../model/checkedin-member';
import { Service } from '../model/service';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Checks-in a user
   * @param data
   */
  createCheckIn(data: CheckIn) {
    const url = `${this.baseUrl}/checkin`;
    return this.http.post<any>(url, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
 * Gets all services
 */
  getServices(): Observable<Array<Service>> {
    const url = `${this.baseUrl}/checkedinmembers/services`;
    return this.http.get<Array<Service>>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gets all checked-in users
   */
  getAllCheckedInRecords(): Observable<Array<CheckedinMember>> {
    const url = `${this.baseUrl}/checkedinmembers`;
    return this.http.get<Array<CheckedinMember>>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gets checked-in users up to the specified date
   * @param date
   */
  getCheckedInRecordsUpToSpecifiedDate(date: string, selectedServiceId: number): Observable<Array<CheckedinMember>> {
    const url = `${this.baseUrl}/checkedinmembers/${date}/${selectedServiceId}`;
    return this.http.get<Array<CheckedinMember>>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gets checked-in users for the date range
   * @param dateFrom
   * @param dateTo
   */
  getCheckedInRecordsForDateRange(dateFrom: string, dateTo: string, selectedServiceId: number): Observable<Array<CheckedinMember>> {
    const url = `${this.baseUrl}/checkedinmembers/${dateFrom}/${dateTo}/${selectedServiceId}`;
    return this.http.get<Array<CheckedinMember>>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  siginIn(data: SignInOut): Observable<SignInOutResponse> {
    const url = `${this.baseUrl}/checkedinmembers/signIn/${data.id}`;
    return this.http.post<SignInOutResponse>(url, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  siginOut(data: SignInOut): Observable<SignInOutResponse> {
    const url = `${this.baseUrl}/checkedinmembers/signOut/${data.id}`;
    return this.http.post<SignInOutResponse>(url, data)
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
