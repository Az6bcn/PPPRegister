import { CheckedinListComponent } from './list/checkedin-list/checkedin-list.component';
import { CheckInComponent } from './check-in/check-in/check-in.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';


@NgModule({
  declarations: [
    AppComponent,
    CheckInComponent,
    CheckedinListComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NotifierModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
