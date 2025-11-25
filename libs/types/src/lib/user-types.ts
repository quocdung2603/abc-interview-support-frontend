// user-types.ts in libs/shared-utils/src/lib/types/user-types.ts

export interface Role {
  roleId: string;
  roleName: 'User' | 'Recruiter' | 'Admin';
  description?: string;
}

export interface User {
  id: number;
  roleId: number;
  roleName: string;
  email: string;
  passWord?: string; // Encrypted - optional for responses
  fullName: string;
  dateOfBirth: string;
  address: string;
  status: string; // 'Pending' | 'Verified' | 'Locked' | 'ACTIVE'
  isStudying: boolean;
  eloScore: number;
  eloRank: string; // 'Newbie' | 'Learner' | etc. or actual values like 'NEWBIE'
  createdAt: string;
  verifyToken?: string | null;
}

export interface RecruiterVerification {
  recruiterVerificationId: number;
  userId: number;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  taxCode: string;
  companyLicense: string; // Chuỗi chứa danh sách documentId (VD: "1,2,3" hoặc JSON như {"ids": [1, 2, 3]})
  verificationStatus: 'unVerified' | 'Pending' | 'Verified' | 'Rejected';
  rejectReason: string;
  verifiedAt?: Date; // Optional, NULL nếu chưa duyệt
  createdAt: Date;
}

export interface CompanyDocument {
  documentId: number;
  documentName: string; // VD: "BusinessLicense", "OperatingLicense"
  documentFilePath: any; // Đường dẫn file PDF trên cloud (VD: S3 URL)
  createdAt: Date;
}

export interface EloHistory {
  eloHistoryId: string;
  userId: string;
  action: string;
  points: number;
  description?: string;
  createdAt: Date;
}
