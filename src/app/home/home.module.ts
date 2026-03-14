import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LogoutComponent } from "../modules/account/logout/logout.component";

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, HomeRoutingModule, LogoutComponent],
})
export class HomeModule {}
