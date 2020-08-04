import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccountService } from '../services/account.service';
import { ForgotPassword } from '../model/forgot-password';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordFG: FormGroup
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AccountService,
    private notifierService: NotifierService
  ) { }

  ngOnInit(){
    this.forgotPasswordFG = this.buildForm(this.fb)
  }

  submit(data: ForgotPassword){
    this.authService.forgotPassword(data.email)
      .subscribe(response => {
        if (response) {
          this.notifierService.notify('success', 'Please check your email and click on the link provided to reset your password');
        }
      },
        err => this.notifierService.notify('error', err)
      );
  }

  cancel() {
    this.router.navigate(['../login']);
  }

  isInValid(data: FormGroup): boolean {
    return data.invalid;
  }

  private buildForm(builder: FormBuilder): FormGroup {
    return builder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email(): AbstractControl { return this.forgotPasswordFG.get('email'); }
}
