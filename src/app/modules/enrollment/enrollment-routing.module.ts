import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEnrollmentComponent } from './list-enrollment/list-enrollment.component';

const routes: Routes = [
  {path:"" ,pathMatch:'full' ,component:ListEnrollmentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentRoutingModule { }
