import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CheckInComponent } from './check-in/check-in/check-in.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckedinListComponent } from './list/checkedin-list-live/checkedin-list.component';
import { CheckedinReportComponent } from './list/checkedin-list/checkedin-report/checkedin-report.component';
import { RegistrationComponent } from './registration/registration.component';
import { CancellationComponent } from './cancellation/cancellation.component';
import { AuthGuardService } from './helper/auth-guard.service';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'checkin-members/live', component: CheckedinListComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'checkedin-members', component: CheckedinReportComponent },
  // { path: 'check-in', component: CheckInComponent },
  { path: 'registration', component: RegistrationComponent, canActivate: [AuthGuardService] },
  { path: 'cancellation', component: CancellationComponent },
  { path: 'passwordreset', component: ResetPasswordComponent},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
