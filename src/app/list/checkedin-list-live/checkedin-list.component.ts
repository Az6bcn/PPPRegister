import { CheckedinMember } from './../../model/checkedin-member';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalRService } from 'src/app/services/SignalR.service';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkedin-list',
  templateUrl: './checkedin-list.component.html',
  styleUrls: ['./checkedin-list.component.css']
})
export class CheckedinListComponent implements OnInit, OnDestroy {

  subscriptions = new Array<Subscription>();
  checkedInMembers = new Array<CheckedinMember>();
  constructor(private signalRService: SignalRService, private notifierService: NotifierService) { }

  ngOnInit() {

    this.signalRService.buildSignalRConnection();
    this.signalRService.UpdateCheckedInMembers();
    this.signalRService.connectSignalR();

    // connection error
    const connectionErrorSub = this.signalRService.connectionError$
    .subscribe( connectionError => {
      if (connectionError) {
        this.notifierService.notify('error', connectionError);
      }
    });
    this.subscriptions.push(connectionErrorSub);

    // connection error
    const connectionStatusSub = this.signalRService.connectionStatus$
    .subscribe( connectionStatus => {
      this.notifierService.notify('warning', connectionStatus);
    });
    this.subscriptions.push(connectionStatusSub);

    // live data
    const liveDataSub = this.signalRService.ReadLiveCheckedInMember()
      .subscribe(response => {
        if (this.checkedInMembers.length === 0) {
          this.checkedInMembers.push(response);
        } else {
          this.checkedInMembers.unshift(response);
        }
      });
    this.subscriptions.push(liveDataSub);
  }

  ngOnDestroy() {
    this.checkedInMembers = [];
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
