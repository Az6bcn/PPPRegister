import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Login } from '../model/login';
import { AccountService } from '../services/account.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  get email(): AbstractControl { return this.loginFG.get('Email'); }
  get password(): AbstractControl { return this.loginFG.get('Password'); }
  loginFG: FormGroup;
  isVisible$: boolean;
  constructor(
    private authService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.loginFG = this.buildForm(this.fb);
  }
  logIn(data: Login) {
    this.authService.login(data)
      .subscribe(response => {
        if (response) {
          this.router.navigate(['../registration']);
        }
      },
        err => {
          console.log('login error', err);
          // happens when server is not running/responding
          if (err instanceof ProgressEvent) {
            this.notifierService.notify('error', 'Something went wrong logging you in. Please try again later');
            return;
          }
          this.notifierService.notify('error', err);
        }
      );
  }

  cancel() {
    this.router.navigate(['../home']);
  }

  isInValid(data: FormGroup): boolean {
    return data.invalid;
  }

  toggleVisibility() {
    this.isVisible$ = !this.isVisible$;
  }

  private buildForm(builder: FormBuilder): FormGroup {
    return builder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]]
    });
  }
}
