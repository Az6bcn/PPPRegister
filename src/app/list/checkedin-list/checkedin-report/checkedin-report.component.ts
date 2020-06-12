import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CheckedinMember } from 'src/app/model/checkedin-member';
import { CheckInService } from 'src/app/services/check-in.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-checkedin-report',
  templateUrl: './checkedin-report.component.html',
  styleUrls: ['./checkedin-report.component.css']
})
export class CheckedinReportComponent implements OnInit, OnDestroy {
  subscriptions = new Array<Subscription>();
  checkedInMembers = new Array<CheckedinMember>();
  dateForm: FormGroup;
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private checkInService: CheckInService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.dateForm = this.buildDateForm(this.formBuilder);
  }

  buildDateForm(formBuilder: FormBuilder) {
    return formBuilder.group({
      date: null,
      range: null
    });
  }

  dateChanged(date: Date) {
    this.checkedInMembers = [];
    if (date) {
      this.isLoading$.next(true);
      const isoDate = date.toISOString();
      const specifiedDateSub = this.checkInService.getCheckedInRecordsUpToSpecifiedDate(isoDate)
        .subscribe(response => {
          this.isLoading$.next(false);
          this.checkedInMembers = response;
          //this.dateForm.reset();
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
        },
          error => {
            this.notifierService.notify('error', error);
            this.isLoading$.next(false);
          });
      this.subscriptions.push(dateRangeSub);
    }
  }

  allRecords() {
    this.isLoading$.next(true);

    this.checkedInMembers = [];

    const allRecordsSub = this.checkInService.getAllCheckedInRecords()
      .subscribe(response => {
        this.isLoading$.next(false);
        this.checkedInMembers = response;
      },
        error => {
          this.notifierService.notify('error', error);
          this.isLoading$.next(false);
        });
    this.subscriptions.push(allRecordsSub);
  }


  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
