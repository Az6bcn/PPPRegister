import { CheckInComponent } from './check-in/check-in/check-in.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckedinListComponent } from './list/checkedin-list/checkedin-list.component';


const routes: Routes = [
  {path: '', component: CheckedinListComponent },
  {path: 'check-in', component: CheckInComponent },
  {path: 'checkedin-members', component: CheckedinListComponent},
  {path: '**', component: CheckedinListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
