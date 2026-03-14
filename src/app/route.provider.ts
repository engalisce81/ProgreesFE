import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routesService: RoutesService) {
  return () => {
    routesService.add([
    {
      path: '/',
      name: 'Home',
      iconClass: 'fas fa-home',
      order: 1,
      layout: eLayoutType.application,
    },
    {
      path: 'universties',
      name: 'Universties',
      iconClass: 'fas fa-university',
      order: 2,
      layout: eLayoutType.application
//      requiredPolicy: 'Acadmy.Univerites',
    },
  
    {
      path: 'students',
      name: 'Students',
      iconClass: 'fas fa-solid fa-user-graduate',
      order: 8,
      layout: eLayoutType.application,
      requiredPolicy: 'Acadmy.Students',
    },
    {
      path: 'teachers',
      name: 'Teachers',
      iconClass: 'fas fa-chalkboard-teacher',
      order: 9,
      layout: eLayoutType.application,
      requiredPolicy: 'Acadmy.Teachers',
    },
    {
      path: 'questionbanks',
      name: 'QBanks',
      iconClass: 'fas fa-database',
      order: 10,
      layout: eLayoutType.application,
      requiredPolicy: 'Acadmy.QuestionBanks',
    },
    {
      path: 'enrollments',
      name: 'Enrollments',
      iconClass: 'fas fa-user-friends',
      order: 11,
      layout: eLayoutType.application,
      requiredPolicy: 'Acadmy.CourseStudents.Edit'

    },
    {
      path: 'advertisement',
      name: 'Ads',
      iconClass: 'fas fa-bullhorn',
      order: 12,
      layout: eLayoutType.application,
      requiredPolicy: 'Acadmy.Advertisements.Create',
    },
     {
      path: 'profile',
      name: 'Profile',
      iconClass: 'fas fa-user-circle',
      order: 13,
      layout: eLayoutType.application,
    },
    ]);
  };
}
