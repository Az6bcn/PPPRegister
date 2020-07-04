import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICancelledBooking } from '../model/cancelled-booking';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CancellationService } from '../services/cancellation.service';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.css']
})
export class CancellationComponent implements OnInit {

  booking: ICancelledBooking = { id: 0, email: '', name: '', surname: ''};
  subscriptions = new Array<Subscription>();
  isLoading$ = new BehaviorSubject<boolean>(false);
  constructor( private route: ActivatedRoute, private notifierService: NotifierService, private cancellationService: CancellationService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.booking.id = Number(params.get('id'));
      this.booking.email = params.get('email');
      this.booking.name = params.get('name');
      this.booking.surname = params.get('surname');

      console.log(this.booking);
    });
  }

  cancelBooking(data: ICancelledBooking){
    this.isLoading$.next(true);
    const cancellationSub = this.cancellationService.createCancellation(data)
      .subscribe(response => {
        this.isLoading$.next(false);
        this.notifierService.notify('success', 'Booking Cancelled successfully');
      },
        error => {
          this.isLoading$.next(false);
          this.notifierService.notify('error', error);
        }
      );
    this.subscriptions.push(cancellationSub);
  }

}
