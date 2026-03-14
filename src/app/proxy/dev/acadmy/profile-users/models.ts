
export interface UpdateProfielDto {
  name?: string;
  logoUrl?: string;
}

export interface UserInfoDto {
  id?: string;
  userName?: string;
  name?: string;
  profilePictureUrl?: string;
  courseJoinCount: number;
  universityId?: string;
  universityName?: string;
  gradeLevelId?: string;
  gradeLevelName?: string;
  collegeId?: string;
  collegeName?: string;
  termId?: string;
  termName?: string;
  accountTypeId?: string;
  accountTypeKey?: string;
  accountTypeName?: string;
  lectureCount: number;
  chapterCount: number;
  isStudentUniversite: boolean;
  walletBalance: number;
}
