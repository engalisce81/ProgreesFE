import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListQuestionbankComponent } from './list-questionbank/list-questionbank.component';
import { BankQuestionComponent } from './bank-question/bank-question.component';

const routes: Routes = [
  {path:'',pathMatch:"full", component:ListQuestionbankComponent},
  {path:':bankId/bankquestion',pathMatch:"full", component: BankQuestionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionbankRoutingModule { }
