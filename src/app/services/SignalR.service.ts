import { CheckedinMember } from './../model/checkedin-member';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { BookingsUpdateSignalR } from '../model/bookings-update-signalR';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private signalRUrl = environment.signalRUrl;


  connectionStatus$ = new BehaviorSubject<string>(null);
  connectionError$ = new BehaviorSubject<string>(null);
  private checkedInUserSub$ = new Subject<CheckedinMember>();
  private availableSlotsSub$ = new Subject<BookingsUpdateSignalR>();
  constructor() { }

  buildSignalRConnection() {
    this.connectionStatus$.next('Building components for connection....');
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.signalRUrl}`)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.elapsedMilliseconds < 60000) {
            // If we've been reconnecting for less than 60 seconds so far,
            // wait between 0 and 10 seconds before the next reconnect attempt.
            return Math.random() * 10000;
          } else {
            // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
            return null;
          }
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this.connectionStatus$.next('Finished building');

    this.hubConnection.onreconnecting(error => {

    });
  }

  async connectSignalR() {
    try {
      this.connectionStatus$.next('Starting connection.....');
      await this.hubConnection.start();
      this.connectionStatus$.next('Connected to the server');
    } catch (error) {
      this.connectionError$.next('Error while starting connection');
    }
  }

  /**
   * Call the hub, not implemented
   */
  SendMessageToHub() {

  }

  /**
   * Client method called from hub, i.e receives updates from hub
   */
  UpdateCheckedInMembers() {
    this.hubConnection.on('UpdateCheckedInMembers', (checkedInMember) => {
      this.hubConnection.on('UpdateCheckedInMembersAsync', (checkedInMember) => {
        this.checkedInUserSub$.next(checkedInMember);
      });
    });
  }


  ReadLiveCheckedInMember(): Observable<CheckedinMember> {
    return this.checkedInUserSub$.asObservable();
  }

  /**
   * Client method called from hub, i.e receives updates from hub
   */
  UpdateSlotsAvailable() {
    this.hubConnection.on('ReceivedBookingsUpdateAsync', (availableSlotsUpdate) => {
      this.availableSlotsSub$.next(availableSlotsUpdate);
    });
  }

  ReadAvailableSlotUpdate(): Observable<BookingsUpdateSignalR> {
    return this.availableSlotsSub$.asObservable();
  }

}
