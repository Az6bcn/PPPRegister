import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../services/account.service';
import { NotifierService } from 'angular-notifier';
import { PasswordMatchValidator } from '../helper/confirm-passwword-validator';
import { ResetPassword } from '../model/reset-password';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  get password(): AbstractControl { return this.resetPasswordFG.get('password'); }
  get confirmPassword(): AbstractControl { return this.resetPasswordFG.get('confirmPassword'); }

  resetDetails: ResetPassword = { email:'', token:'', newPassword:'', confirmPassword:''}
  resetPasswordFG: FormGroup
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AccountService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.resetPasswordFG = this.buildForm(this.fb)
    this.route.queryParamMap.subscribe(params => {
      this.resetDetails.email = params.get('email');
      this.resetDetails.token = params.get('token');
    })
  }

  submit(data){
    this.resetDetails.newPassword = data.password;
    this.resetDetails.confirmPassword = data.confirmPassword;
    this.authService.resetPassword(this.resetDetails)
      .subscribe(response => {
        if (response) {
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
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: PasswordMatchValidator });
  }
}
