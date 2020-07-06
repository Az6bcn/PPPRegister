import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { IRegistrant } from 'src/app/model/registrant';
import { RegistrationService } from '../services/registration.service';
import { SignalRService } from '../services/SignalR.service';
import { Slots } from '../model/slots-available';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationFG: FormGroup;
  members: FormArray;
  slots = new Array<Slots>();
  subscriptions = new Array<Subscription>();
  isLoading$ = new BehaviorSubject<boolean>(false);
  canShowRegistrant$ = new BehaviorSubject<boolean>(false);
  selectedSlot$ = new BehaviorSubject<Slots>(void 0);
  registrant: IRegistrant;
  sundayDate: Date;
  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private signalRService: SignalRService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.registrationFG = this.buildRegistrationForm(this.fb);
    this.sundayDate = this.getNextSunday();
    this.isLoading$.next(true);
    const slotsSub = this.registrationService.getSlotsAvailable(this.sundayDate.toISOString())
      .subscribe(response => {
        this.isLoading$.next(false);
        this.slots = response;
      },
        error => {
          this.isLoading$.next(false);
          this.notifierService.notify('error', 'error loading slots available');
        }
      );

    this.subscriptions.push(slotsSub);

    this.signalRService.buildSignalRConnection();
    this.signalRService.UpdateSlotsAvailable();
    this.signalRService.connectSignalR();

    // live data
    const liveDataSub = this.signalRService.ReadAvailableSlotUpdate()
      .subscribe(response => {
        // use respone to update available slot: so that ayone on the page is aware of the updates
        const selectedIndex = this.slots.findIndex(x => x.time === response.time);
        // const slots = this.slots.filter(x => x.serviceId !== response.serviceId);
        const mappedResponse = {
          total: response.total,
          adultsAvailableSlots: response.adultsAvailableSlots,
          kidsAvailableSlots: response.kidsAvailableSlots,
          toddlersAvailableSlots: response.toddlersAvailableSlots,
          serviceId: response.serviceId,
          time: response.time
        } as unknown as Slots;
        this.slots.splice(selectedIndex, 1, mappedResponse);
        this.slots = [...this.slots];
      });
    this.subscriptions.push(liveDataSub);

  }

  buildRegistrationForm(fb: FormBuilder) {

    return fb.group({
      time: ['', Validators.required],
      members: this.fb.array([this.createRegistrant()]),
      emailAddress: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]{11}')]],
    });
  }
  onTimeChange(slot: Slots) {
    this.canShowRegistrant$.next(true);
    this.selectedSlot$.next(slot);
  }
  register(data: IRegistrant) {
    data.serviceId = this.selectedSlot$.getValue().serviceId;
    data.date = this.sundayDate.toISOString();
    if (data.members.length > 1) { data.isGroupBooking = true; } else { data.member = data.members[0]; }
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
      gender: ['', Validators.required],
      categoryId: ['', Validators.required],
      pickUp: false
    });
  }

  addRegistrant(): void {
    this.members = this.registrationFG.get('members') as FormArray;
    this.members.push(this.createRegistrant());
  }

  get memberControl() {
    // tslint:disable-next-line:no-string-literal
    return this.registrationFG.get('members')['controls'];
  }

  get membersDet(): FormArray {
    return this.registrationFG.get('members') as FormArray;
  }

  removeRegistrant(i: number) {
    this.members.removeAt(i);
  }

  isValid() {
    return this.registrationFG.invalid;
  }

  getNextSunday() {
    const date = new Date();
    date.setDate(date.getDate() + (7 - date.getDay()));

    return date;
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


