import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { IRegistrant } from 'src/app/model/registrant';
import { RegistrationService } from '../services/registration.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationFG: FormGroup;
  members: FormArray;
  subscriptions = new Array<Subscription>();
  isLoading$ = new BehaviorSubject<boolean>(false);
  registrant: IRegistrant;
  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.registrationFG = this.buildRegistrationForm(this.fb);
    console.log(this._emailAddress.errors)
  }

  buildRegistrationForm(fb: FormBuilder) {

    return fb.group({
      time: ['', Validators.required],
      members: this.fb.array([this.createRegistrant()]),
      emailAddress: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]{11}')]],
    })
  }

  onSubmit(any) {
    // for (let control of this.registrationFG.get('registrants')['controls']) {
    //   this.registrant = {
    //     date: Date.now().toString(),
    //     service: this.registrationFG.get('service').value,
    //     emailAddress: this.registrationFG.get('emailAddress').value,
    //     phoneNumber: this.registrationFG.get('phoneNumber').value,
    //     firstName: control.get('firstName').value,
    //     lastName: control.get('lastName').value,
    //     gender: control.get('gender').value
    //   }
    //   this.register(this.registrant)
    // }
    console.log(any);
    
  }

  register(data: IRegistrant) {
    data.date = 'July 5, 2020';
    if(data.members.length > 1){ data.isGroupBooking = true }
    else{ data.member = data.members[0]}
    this.isLoading$.next(true);
    const registrationSub = this.registrationService.createRegistration(data)
      .subscribe(response => {
        this.isLoading$.next(false);
        this.registrationFG.reset();
        this.notifierService.notify('success', 'Checked in successfully');
      },
        error => {
          this.isLoading$.next(false);
          this.notifierService.notify('error', error);
        }
      );

    this.subscriptions.push(registrationSub);
  }

  createRegistrant(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', Validators.required]
    })
  }

  addRegistrant(): void {
    this.members = this.registrationFG.get('members') as FormArray;
    this.members.push(this.createRegistrant());
  }

  get memberControl() {
    return this.registrationFG.get('members')['controls'];
  }

  get membersDet(): FormArray {
    return this.registrationFG.get('members') as FormArray;
  }

  removeRegistrant(i: number) {
    this.members.removeAt(i);
    console.log(this._members.value)
  }

  isValid() {
    return this.registrationFG.invalid;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  cancel() {
    this.registrationFG.reset();
    this.notifierService.notify('success', 'Canceled');
  }

  get _time(): AbstractControl { return this.registrationFG.get('time'); }
  get _emailAddress(): AbstractControl { return this.registrationFG.get('emailAddress'); }
  get _mobile(): AbstractControl { return this.registrationFG.get('mobile'); }
  get _members(): AbstractControl { return this.registrationFG.get('members'); }
}


