export interface Submission {
  event: string; // _id
  fileType: string;
  fileLanguage: string;
  student: string;
  _id: string;
  fileURL: string;
  extractedContent?: string;
  summary?: string;
  finalScore?: number;
  defaultParamsScore?: number;
  paramsWise?: string[];
  submittedAt?: Date;
}
