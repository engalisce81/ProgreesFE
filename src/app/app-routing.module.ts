import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';
import { GuestGuard } from './guards/guest-guard';
const routes: Routes = [
 
    {
    path: '',
    pathMatch: 'full',
    canActivate:[AuthRedirectGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'universties',
    canActivate:[AuthRedirectGuard],
    loadChildren: () => import('./modules/university/university.module').then(m => m.UniversityModule),
  }, 

  
  {
    path: 'advertisement',
    canActivate:[AuthRedirectGuard],
    loadChildren: () => import('./modules/advertisement/advertisement.module').then(m => m.AdvertisementModule),
  },
 
  {
    path: 'account',
    canActivate: [GuestGuard], // منع المسجلين من الدخول هنا
    loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule),
  },
  {
    path: 'students',
        canActivate:[AuthRedirectGuard],

    loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule),
  },
  {
    path: 'teachers',
    canActivate:[AuthRedirectGuard],
    loadChildren: () => import('./modules/teacher/teacher.module').then(m => m.TeacherModule),
  },

 {
    path: 'enrollments',
    canActivate:[AuthRedirectGuard],
    loadChildren: () => import('./modules/enrollment/enrollment.module').then(m => m.EnrollmentModule),
  },
  {
    path: 'questionbanks',
    canActivate:[AuthRedirectGuard],
    loadChildren: () => import('./modules/questionbank/questionbank.module').then(m => m.QuestionbankModule),
  },

  {
    path: 'profile',
    canActivate:[AuthRedirectGuard],
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
  },

  {
    path: 'report-messages',
    canActivate:[AuthRedirectGuard],
    loadChildren: () => import('./modules/report-messages/report-messages.module').then(m => m.ReportMessagesModule),
  },

  {
    path: 'policy',
    loadChildren: () => import('./modules/policy/policy.module').then(m => m.PolicyModule),
  },
  
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.TenantManagementModule.forLazy()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
