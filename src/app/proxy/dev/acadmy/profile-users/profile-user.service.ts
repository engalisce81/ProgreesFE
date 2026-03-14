import type { UpdateProfielDto, UserInfoDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class ProfileUserService {
  apiName = 'Default';
  

  getTeacherProfile = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserInfoDto>({
      method: 'GET',
      url: '/api/app/profile-user/teacher-profile',
    },
    { apiName: this.apiName,...config });
  

  getUserInfo = (deviceIp: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<UserInfoDto>>({
      method: 'GET',
      url: '/api/app/profile-user/user-info',
      params: { deviceIp },
    },
    { apiName: this.apiName,...config });
  

  updateAllUserData = (input: UpdateProfielDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<UserInfoDto>>({
      method: 'PUT',
      url: '/api/app/profile-user/all-user-data',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
