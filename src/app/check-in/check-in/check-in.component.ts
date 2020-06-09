import { CheckInService } from './../../services/check-in.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { CheckIn } from 'src/app/model/check-in';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {

  checkInFG: FormGroup;
  constructor(private fb: FormBuilder, private checkinService: CheckInService) { }

  ngOnInit() {
    this.checkInFG = this.buildCheckinForm(this.fb);
  }

  buildCheckinForm(fb: FormBuilder) {

    return fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      mobile: ['', Validators.required]
    });
  }

  checkin(data: CheckIn) {
    console.log('data', data);
    this.checkinService.createCheckIn(data)
      .subscribe(response => {
        console.log('added successfully');
      });
  }

  cancel() {
    this.checkInFG.reset();
  }

  isValid() {
    console.log(this.checkInFG);
    return this.checkInFG.invalid;
  }

  get _name(): AbstractControl {return this.checkInFG.get('name'); }
  get _surname(): AbstractControl {return this.checkInFG.get('surname'); }
  get _mobile(): AbstractControl {return this.checkInFG.get('mobile'); }
}
