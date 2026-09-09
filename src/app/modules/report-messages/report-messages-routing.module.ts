import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportMessagesComponent } from './report-messages.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component:ReportMessagesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportMessagesRoutingModule { }
