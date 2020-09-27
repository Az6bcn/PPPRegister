import { AccountService } from './../services/account.service';
import { FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Register } from '../model/register';
import { PasswordMatchValidator } from '../helper/confirm-passwword-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  get email(): AbstractControl { return this.registerFG.get('email'); }
  get password(): AbstractControl { return this.registerFG.get('password'); }
  get confirmPassword(): AbstractControl { return this.registerFG.get('confirmPassword'); }
  get name(): AbstractControl { return this.registerFG.get('name'); }
  get category(): AbstractControl { return this.registerFG.get('categoryId'); }
  get gender(): AbstractControl { return this.registerFG.get('gender'); }
  get surname(): AbstractControl { return this.registerFG.get('surname'); }
  get mobile(): AbstractControl { return this.registerFG.get('mobile'); }
  registerFG: FormGroup;
  isVisible1$: boolean
  isVisible2$: boolean
  today = new Date();
  categories: Array<{ label: string, idValue: number }>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AccountService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.registerFG = this.buildForm(this.fb);
    this.categories = [
      { label: 'Adult', idValue: 1 },
      { label: 'Children (ages 7-12)', idValue: 2 },
      { label: 'Children (ages 3-6)', idValue: 3 }
    ];
  }
  register(data: Register) {

    data.categoryId = data.categoryId as unknown as number;

    this.authService.register(data)
      .subscribe(response => {
        if (response.success) {
          this.notifierService.notify('success', 'Please login to book your slot');
          this.router.navigate(['/login']);
        }
      },
        err => this.notifierService.notify('error', err)
      );
  }

  cancel() {
    this.router.navigate(['../home']);
  }

  isInValid(data: FormGroup): boolean {
    return data.invalid;
  }
  private buildForm(builder: FormBuilder) {
    return builder.group({
      name: ['', Validators.required],
      surname: ['', [Validators.required]],
      mobile: ['', [Validators.required, , Validators.pattern('[0-9]{11}')]],
      gender: ['', Validators.required],
      categoryId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: PasswordMatchValidator });
  }

  toggleVisibility(id) {
    if (id == "1") {this.isVisible1$ = !this.isVisible1$;}
    else {this.isVisible2$ = !this.isVisible2$;}
  }

}
