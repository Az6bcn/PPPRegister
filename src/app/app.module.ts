import { JwtModule, JwtInterceptor } from '@auth0/angular-jwt';
import { CheckedinListComponent } from './list/checkedin-list-live/checkedin-list.component';
import { CheckInComponent } from './check-in/check-in/check-in.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { CheckedinReportComponent } from './list/checkedin-list/checkedin-report/checkedin-report.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './horizontal-loader/loader/loader.component';
import { RegistrationComponent } from './registration/registration.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CancellationComponent } from './cancellation/cancellation.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TokenGetter } from './helper/jwt-getter';
import { MatTabsModule } from '@angular/material/tabs';




@NgModule({
  declarations: [
    AppComponent,
    CheckInComponent,
    CheckedinListComponent,
    CheckedinReportComponent,
    LoaderComponent,
    RegistrationComponent,
    CancellationComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NotifierModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    PaginationModule.forRoot(),
    NgSelectModule,
    MatTabsModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: TokenGetter,
      }
    }),
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
