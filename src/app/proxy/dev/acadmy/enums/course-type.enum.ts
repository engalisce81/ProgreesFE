import { mapEnumToOptions } from '@abp/ng.core';

export enum CourseType {
  All = 0,
  Quiz = 1,
  Pdf = 2,
}

export const courseTypeOptions = mapEnumToOptions(CourseType);
