import { CheckInComponent } from './check-in/check-in/check-in.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckedinListComponent } from './list/checkedin-list-live/checkedin-list.component';
import { CheckedinReportComponent } from './list/checkedin-list/checkedin-report/checkedin-report.component';


const routes: Routes = [
  { path: '', component: CheckInComponent },
  { path: 'checkin-members/live', component: CheckedinListComponent },
  { path: 'checkedin-members', component: CheckedinReportComponent },
  { path: 'check-in', component: CheckInComponent },
  { path: '**', component: CheckInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
