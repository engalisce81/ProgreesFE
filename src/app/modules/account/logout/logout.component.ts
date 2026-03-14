import { ConfigStateService } from '@abp/ng.core';
import { Component } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { HomeService } from '@proxy/dev/acadmy/homes';
import { CollegeService } from '@proxy/dev/acadmy/universites';

import { LoginService } from 'src/app/service/loginService';

@Component({
  selector: 'app-logout',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  termList: any[] = [];
  selectedTermId: string = '';
roles:string []  =[] ;

  constructor(
    private loginService: LoginService,
    private collegeService: CollegeService,
    private homeService: HomeService,
    private config: ConfigStateService 
  ) {}

  async ngOnInit() {

      const user = this.config.getOne("currentUser");
  console.log('Current user:', user);
  this.roles = user?.roles ?? [];
     this.collegeService.getTermList().subscribe({
      next: (next) => this.termList=next.items,
    });
  }
 hasRole(role: string): boolean {
  return this.roles.includes(role);
}
  logout() {
    this.loginService.logout();
  }

  async onTermChange() {
    if (this.selectedTermId) {
       this.homeService.updateActiveTerm(this.selectedTermId).subscribe({
        next:(next)=> console.log("تم تحديث الترم بنجاح")
       });
    }
  }
}
