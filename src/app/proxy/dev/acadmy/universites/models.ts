import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';

export interface CollegeDto extends EntityDto<string> {
  name?: string;
  universityId?: string;
  universityName?: string;
}

export interface CreateUpdateCollegeDto {
  name?: string;
  universityId?: string;
  gradeLevelCount: number;
}

export interface CreateUpdateGradeLevelDto {
  name?: string;
  collegeId?: string;
  collegeName?: string;
}

export interface CreateUpdateSubjectDto {
  name?: string;
  termId?: string;
  gradeLevelId?: string;
}

export interface CreateUpdateUniversityDto {
  name?: string;
}

export interface GradeLevelDto extends EntityDto<string> {
  name?: string;
  collegeId?: string;
  collegeName?: string;
}

export interface SubjectDto extends EntityDto<string> {
  name?: string;
  termId?: string;
  termName?: string;
  gradeLevelId?: string;
  gradeLevelName?: string;
  collegeId?: string;
  collegeName?: string;
  universityId?: string;
  universityName?: string;
}

export interface UniversityDto extends AuditedEntityDto<string> {
  name?: string;
}
