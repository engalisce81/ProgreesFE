
export interface GrowthOverYearDto {
  students: MonthlyCountDto[];
  teachers: MonthlyCountDto[];
}

export interface HomesDto {
  nameFiledOne?: string;
  countFiledOne: number;
  percentageFiledOne: number;
  nameFiledTwo?: string;
  countFiledTwo: number;
  percentageFiledTwo: number;
  nameFiledThree?: string;
  countFiledThree: number;
  percentageFiledThree: number;
  members: MemberDto[];
  growthOverYear: GrowthOverYearDto;
}

export interface MemberDto {
  id?: string;
  memberName?: string;
  membersCount: number;
}

export interface MonthlyCountDto {
  month?: string;
  count: number;
}
