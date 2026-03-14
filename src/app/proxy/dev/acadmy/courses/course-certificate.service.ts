import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateCourseCertificateDto } from '../dtos/request/courses/models';
import type { CourseCertificateDto } from '../dtos/response/courses/models';

@Injectable({
  providedIn: 'root',
})
export class CourseCertificateService {
  apiName = 'Default';


  createOrUpdate = (input: CreateUpdateCourseCertificateDto, config?: Partial<Rest.Config>) => {
    const formData = new FormData();
 
    // إضافة الملف
    if (input.templateFile) {
      formData.append('templateFile', input.templateFile);
    }

    // إضافة بقية البيانات (التي سيستقبلها الـ Backend من الـ Form)
    if (input.courseId) formData.append('courseId', input.courseId);
    formData.append('nameXPosition', input.nameXPosition.toString());
    formData.append('nameYPosition', input.nameYPosition.toString());

    return this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/course-certificate/or-update',
      body: formData, // نرسل الـ FormData هنا
    },
      { apiName: this.apiName, ...config });
  };

  downloadCertificate = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Blob>({
      method: 'GET',
      responseType: 'blob',
      url: `/api/app/course-certificate/download-certificate/${courseId}`,
    },
      { apiName: this.apiName, ...config });

  downloadCertificateToUpate = (courseId: string, config?: Partial<Rest.Config>) =>

    this.restService.request<any, Blob>({

      method: 'GET',

      responseType: 'blob',

      url: `/api/app/course-certificate/download-certificate-to-upate/${courseId}`,

    },

      { apiName: this.apiName, ...config });


  getByCourseId = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CourseCertificateDto>({
      method: 'GET',
      url: `/api/app/course-certificate/by-course-id/${courseId}`,
    },
      { apiName: this.apiName, ...config });

  constructor(private restService: RestService) { }
}
