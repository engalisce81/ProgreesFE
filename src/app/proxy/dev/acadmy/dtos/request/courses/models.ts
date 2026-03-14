
export interface CreateUpdateCourseCertificateDto {
  courseId?: string;
  templateFile: File;
  nameXPosition?: string;
  nameYPosition?: string;
}

export interface CreateUpdateCourseFeedbackDto {
  courseId: string;
  rating: number;
  comment: string;
  isAccept: boolean;
}
