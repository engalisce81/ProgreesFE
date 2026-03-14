import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAdvertisementComponent } from './list-advertisment/list-advertisment.component';

const routes: Routes = [
  {path:'' , component:ListAdvertisementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvertisementRoutingModule { }
