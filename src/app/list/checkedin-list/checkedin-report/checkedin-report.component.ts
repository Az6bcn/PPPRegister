import { SignInOut } from './../../../model/sigin-in-out';
import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CheckedinMember } from 'src/app/model/checkedin-member';
import { CheckInService } from 'src/app/services/check-in.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-checkedin-report',
  templateUrl: './checkedin-report.component.html',
  styleUrls: ['./checkedin-report.component.css']
})
export class CheckedinReportComponent implements OnInit, OnDestroy {
  subscriptions = new Array<Subscription>();
  checkedInMembers = new Array<CheckedinMember>();
  checkedInMembersPaginated = new Array<CheckedinMember>();
  dateForm: FormGroup;
  isLoading$ = new BehaviorSubject<boolean>(false);

  totalItems$ = new BehaviorSubject<number>(0);
  itemsPerPage = 10;

  constructor(
    private checkInService: CheckInService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.dateForm = this.buildDateForm(this.formBuilder);
  }

  dateChanged(date: Date) {
    this._range.reset();
    this.checkedInMembers = [];
    if (date) {
      this.isLoading$.next(true);
      const isoDate = date.toISOString();
      const specifiedDateSub = this.checkInService.getCheckedInRecordsUpToSpecifiedDate(isoDate)
        .pipe(
          map(data => {
            return data.map(d => {
              d.serviceName = this.mapServiceName(d.serviceId);
              return d;
            });
          })
        )
        .subscribe(response => {
          this.isLoading$.next(false);
          this.checkedInMembers = response;
          this.checkedInMembersPaginated = response.slice(0, 10);
          this.totalItems$.next(response.length);
          // this.dateForm.reset();
        },
          error => {
            this.notifierService.notify('error', error);
            this.isLoading$.next(false);
          });
      this.subscriptions.push(specifiedDateSub);
    }
  }

  dateRangeChanged(date: Array<Date>) {

    this.checkedInMembers = [];
    if (date) {
      this.isLoading$.next(true);
      const isoFromDate = date[0].toISOString();
      const isoToDate = date[1].toISOString();
      const dateRangeSub = this.checkInService.getCheckedInRecordsForDateRange(isoFromDate, isoToDate)
        .subscribe(response => {
          this.isLoading$.next(false);
          this.checkedInMembers = response;
          this.checkedInMembersPaginated = response.slice(0, 10);
          this.totalItems$.next(response.length);
        },
          error => {
            this.notifierService.notify('error', error);
            this.isLoading$.next(false);
          });
      this.subscriptions.push(dateRangeSub);
    }
  }

  allRecords() {
    this.dateForm.reset();
    this.isLoading$.next(true);

    this.checkedInMembers = [];

    const allRecordsSub = this.checkInService.getAllCheckedInRecords()
      .subscribe(response => {
        this.isLoading$.next(false);
        this.checkedInMembers = response;
        this.checkedInMembersPaginated = response.slice(0, 10);
        this.totalItems$.next(response.length);
      },
        error => {
          this.notifierService.notify('error', error);
          this.isLoading$.next(false);
        });
    this.subscriptions.push(allRecordsSub);
  }

  mapServiceName(serviceId: number) {
    if (serviceId === 1) { return 'First Service'; }
    if (serviceId === 2) { return 'Second Service'; }
    return 'Workers Meeting';
  }

  signIn(data: CheckedinMember) {
    const signInData = this.getSigInOut(data);
    this.checkInService.siginIn(signInData)
      .subscribe(response => {
        const member = this.checkedInMembers.find(x => x.id === response.id);
        member.signedIn = response.date;

        this.checkedInMembers === [...this.checkedInMembers];

        this.notifierService.notify('success', 'Signed-in successfully');
      },
        err => this.notifierService.notify('error', err));
  }

  signOut(data: CheckedinMember) {
    const signOutData = this.getSigInOut(data);
    this.checkInService.siginOut(signOutData)
      .subscribe(response => {
        const member = this.checkedInMembers.find(x => x.id === response.id);
        member.signedOut = response.date;

        this.checkedInMembers === [...this.checkedInMembers];

        this.notifierService.notify('success', 'Signed-out successfully');
      },
        err => this.notifierService.notify('error', err));
  }

  buildDateForm(formBuilder: FormBuilder) {
    return formBuilder.group({
      date: null,
      range: null
    });
  }

  pageChanged(event: any) {
    console.log('event', event);
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.checkedInMembersPaginated = [...this.checkedInMembers.slice(startItem, endItem)];
  }

  getSigInOut(data: CheckedinMember) {
    const signinData = {
      id: data.id,
      date: data.date,
      serviceId: data.serviceId,
      time: data.time
    } as SignInOut;

    return signinData;
  }

  get _date() { return this.dateForm.get('date'); }
  get _range() { return this.dateForm.get('range'); }


  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
