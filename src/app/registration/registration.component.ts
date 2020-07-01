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
  registrants: FormArray;
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
    console.log(this.registrationFG.get('registrants')['controls'])
  }

  buildRegistrationForm(fb: FormBuilder) {

    return fb.group({
      service: ['', Validators.required],
      registrants: this.fb.array([this.createRegistrant()]),
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]]
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
    this.registrationFG.reset();
  }

  register(data: IRegistrant) {
    this.isLoading$.next(true);
    const registrationSub = this.registrationService.createRegistration(data)
      .subscribe(response => {
        this.isLoading$.next(false);
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required]
    })
  }

  addRegistrant(): void {
    this.registrants = this.registrationFG.get('registrants') as FormArray;
    this.registrants.push(this.createRegistrant());
  }

  get registrantControl() {
    return this.registrationFG.get('registrants')['controls'];
  }

  get registrantsDet(): FormArray {
    return this.registrationFG.get('registrants') as FormArray;
  }

  removeRegistrant(i: number) {
    this.registrants.removeAt(i);
    console.log(this._registrants.value)
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

  get _service(): AbstractControl { return this.registrationFG.get('service'); }
  get _emailAddress(): AbstractControl { return this.registrationFG.get('emailAddress'); }
  get _phoneNumber(): AbstractControl { return this.registrationFG.get('phoneNumber'); }
  get _registrants(): AbstractControl { return this.registrationFG.get('registrants'); }
}


