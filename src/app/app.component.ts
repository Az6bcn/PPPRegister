import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PPPRegisterClient';
  canShowLogo$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.canShowLogo$.next(true);
  }
}
