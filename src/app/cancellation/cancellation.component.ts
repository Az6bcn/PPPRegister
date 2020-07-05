import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICancelledBooking } from '../model/cancelled-booking';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CancellationService } from '../services/cancellation.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.css']
})
export class CancellationComponent implements OnInit, OnDestroy {

  booking: ICancelledBooking = { id: 0, email: '', name: '', surname: '' };
  subscriptions = new Array<Subscription>();
  isLoading$ = new BehaviorSubject<boolean>(true);
  isCancelled$ = new BehaviorSubject<boolean>(false);
  isAlreadyCancelled$ = new BehaviorSubject<boolean>(false);
  foundBooking: any;
  constructor(
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private cancellationService: CancellationService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.booking.id = (params.get('bookingId') as unknown as number);
      this.booking.email = params.get('email');
      this.booking.name = params.get('name');
      this.booking.surname = params.get('surname');
    });

    if (this.booking.id > 0) {
      this.findBooking(this.booking.id);
    }

  }

  findBooking(bookingId: number) {
    const bookingSub = this.cancellationService.findBooking(bookingId)
      .pipe(
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe(response => {
        if (response.cancellable) {
          this.foundBooking = response.data;

          if (this.foundBooking.serviceId === 1) {
            this.findBooking = { ...this.foundBooking, serviceName: 'First service' };
            return;
          } else if (this.foundBooking.serviceId === 2) {
            this.findBooking = { ...this.foundBooking, serviceName: 'Second service' };
            return;
          }

          this.findBooking = { ...this.foundBooking, serviceName: 'Workers Meeting' };
          return;
        }
        this.isAlreadyCancelled$.next(true);
      },
        error => {
          this.notifierService.notify('error', error);
        }
      );
    this.subscriptions.push(bookingSub);
  }
  cancelBooking(data: ICancelledBooking) {
    const cancellationSub = this.cancellationService.createCancellation(data)
      .subscribe(response => {
        this.isCancelled$.next(true);
        this.notifierService.notify('success', 'Booking Cancelled successfully');
      },
        error => {
          this.notifierService.notify('error', error);
        }
      );
    this.subscriptions.push(cancellationSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
