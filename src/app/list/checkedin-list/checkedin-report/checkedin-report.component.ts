import { SignalRService } from 'src/app/services/SignalR.service';
import { Attendance } from './../../../model/attendance';
import { SignInOut } from './../../../model/sigin-in-out';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CheckedinMember } from 'src/app/model/checkedin-member';
import { CheckInService } from 'src/app/services/check-in.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { map } from 'rxjs/operators';
import { Service } from 'src/app/model/service';
import * as moment from 'moment';

@Component({
  selector: 'app-checkedin-report',
  templateUrl: './checkedin-report.component.html',
  styleUrls: ['./checkedin-report.component.css']
})
export class CheckedinReportComponent implements OnInit, OnDestroy {

  constructor(
    private checkInService: CheckInService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private signalRService: SignalRService
  ) { }
  pickUpDatePickerSelected$ = new BehaviorSubject<any>(null);
  pickUpBtnEnabled$ = new BehaviorSubject<boolean>(true);

  get _date() { return this.dateForm.get('date'); }
  get _range() { return this.dateForm.get('range'); }
  subscriptions = new Array<Subscription>();
  checkedInMembers = new Array<CheckedinMember>();
  checkedInMembersPaginated = new Array<CheckedinMember>();
  dateForm: FormGroup;
  isLoading$ = new BehaviorSubject<boolean>(false);

  totalItems$ = new BehaviorSubject<number>(0);
  itemsPerPage = 10;
  canShowFilters$ = new BehaviorSubject<boolean>(true);
  selectedService$ = new BehaviorSubject<number>(0);
  items = new Array<Service>();
  attendance: Attendance;
  ngOnInit(): void {

    const today = new Date();
    const momentDate = moment(today, 'DD/MM/YYYY');
    const date = momentDate.format();

    this.checkInService.getAttendance(date)
      .subscribe(response => {
        response.groupedResult.map(d => {
          d.serviceName = this.mapServiceName(d.serviceId);
          return d;
        });
        this.attendance = response;
      });

    this.dateForm = this.buildDateForm(this.formBuilder);

    const serviceSub = this.checkInService.getServices()
      .subscribe(response => {
        this.items = response;
      });
    this.subscriptions.push(serviceSub);

    this.signalRService.buildSignalRConnection();
    this.signalRService.BookingsAfterSignin();
    this.signalRService.connectSignalR();

    // live data
    const liveDataSub = this.signalRService.ReadBookingsAfterSigninpdate()
      .subscribe(response => {
        this.checkedInMembers = [...response];
        this.checkedInMembersPaginated = [...response.slice(0, 10)];
        this.totalItems$.next(response.length);
      });
    this.subscriptions.push(liveDataSub);
  }

  dateChanged(date: Date) {
    this._range.reset();
    this.checkedInMembers = [];
    if (date) {
      this.isLoading$.next(true);

      const momentDate = moment(date, 'DD/MM/YYYY');
      const isoDate = momentDate.format();

      this.getServiceAttendanceForDate(isoDate);
      const selectedServiceId = this.selectedService$.getValue();
      const specifiedDateSub = this.checkInService.getCheckedInRecordsUpToSpecifiedDate(isoDate, selectedServiceId)
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
    // this._date.setValue('');
    this.checkedInMembers = [];
    if (date) {
      this.isLoading$.next(true);
      const momentFromDate = moment(date[0], 'DD/MM/YYYY');
      const momentToDate = moment(date[1], 'DD/MM/YYYY');
      const isoFromDate = momentFromDate.format();
      const isoToDate = momentToDate.format();

      const selectedServiceId = this.selectedService$.getValue();
      const dateRangeSub = this.checkInService.getCheckedInRecordsForDateRange(isoFromDate, isoToDate, selectedServiceId)
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
    if (serviceId === 1) { return 'Second Service'; }
    if (serviceId === 2) { return 'Third Service'; }
    return 'First Service';
  }

  signIn(data: CheckedinMember) {
    const signInData = this.getSigInOut(data);
    this.checkInService.siginIn(signInData)
      .subscribe(response => {
        // const member = this.checkedInMembers.find(x => x.id === response.id);
        // member.signedIn = response.date;

        // this.checkedInMembers === [...this.checkedInMembers];

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
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.checkedInMembersPaginated = [...this.checkedInMembers.slice(startItem, endItem)];
  }

  pickUpDatePickerValueChange(date: Date) {
    this.pickUpBtnEnabled$.next(false);

    const momentDate = moment(date, 'DD/MM/YYYY');
    const isoDate = momentDate.format();

    this.pickUpDatePickerSelected$.next(isoDate);
  }

  pickUpReport() {
    const selectedDate = this.pickUpDatePickerSelected$.getValue();

    if (selectedDate) {
      const pickUpReport = this.checkInService.getPickUpReport(selectedDate)
        .subscribe(response => {
          this.isLoading$.next(false);
          this.checkedInMembers = response;
          this.checkedInMembersPaginated = response.slice(0, 10);
          this.totalItems$.next(response.length);
          // this.dateForm.reset();
          this.pickUpBtnEnabled$.next(true);
        },
          error => {
            this.notifierService.notify('error', error);
            this.isLoading$.next(false);
          });
      this.subscriptions.push(pickUpReport);
    }
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

  public selected(value: any): void {
    this.canShowFilters$.next(false);
    this.dateForm.reset();
    this.selectedService$.next(value.id);
  }

  getServiceAttendanceForDate(date: string) {
    this.checkInService.getAttendance(date)
      .subscribe(response => {
        response.groupedResult.map(d => {
          d.serviceName = this.mapServiceName(d.serviceId);
          return d;
        });
        this.attendance = { ...response };
      });

  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
