import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermConditionsComponent } from './term-conditions/term-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DeletAccountComponent } from './delet-account/delet-account.component';

const routes: Routes = [
  {path:'term-conditions', component:TermConditionsComponent},
  {path:'privacy-policy', component:PrivacyPolicyComponent},
  {path:'delete-account', component:DeletAccountComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
