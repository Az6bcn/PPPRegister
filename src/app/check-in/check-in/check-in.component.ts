import { CheckInService } from './../../services/check-in.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { CheckIn } from 'src/app/model/check-in';
import { NotifierService } from 'angular-notifier';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit, OnDestroy {

  checkInFG: FormGroup;
  subscriptions = new Array<Subscription>();
  isLoading$ = new BehaviorSubject<boolean>(false);
  constructor(
    private fb: FormBuilder,
    private checkinService: CheckInService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.checkInFG = this.buildCheckinForm(this.fb);
  }

  buildCheckinForm(fb: FormBuilder) {

    return fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]]
    });
  }

  checkin(data: CheckIn) {
    this.isLoading$.next(true);
    const checkInSub = this.checkinService.createCheckIn(data)
      .subscribe(response => {
        this.isLoading$.next(false);
        this.checkInFG.reset();
        this.notifierService.notify('success', 'Checked in successfully');
      },
        error => {
          this.isLoading$.next(false);
          this.notifierService.notify('error', error);
        }
      );

    this.subscriptions.push(checkInSub);
  }

  cancel() {
    this.checkInFG.reset();
    this.notifierService.notify('success', 'Canceled');
  }

  isValid() {
    return this.checkInFG.invalid;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  get _name(): AbstractControl { return this.checkInFG.get('name'); }
  get _surname(): AbstractControl { return this.checkInFG.get('surname'); }
  get _mobile(): AbstractControl { return this.checkInFG.get('mobile'); }
}
