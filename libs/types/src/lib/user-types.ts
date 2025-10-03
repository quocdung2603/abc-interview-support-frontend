// user-types.ts in libs/shared-utils/src/lib/types/user-types.ts

export interface Role {
  roleId: string;
  roleName: 'User' | 'Recruiter' | 'Admin';
  description?: string;
}

export interface User {
  userId: string;
  roleId: string;
  email: string;
  passWord: string; // Encrypted
  fullName: string;
  dateOfBirth: Date;
  address: string;
  status: 'Pending' | 'Verified' | 'Locked';
  isStudying: boolean;
  eloScore: number;
  eloRank:
    | 'Newbie'
    | 'Learner'
    | 'Contributor'
    | 'Solver'
    | 'Expert'
    | 'Senior Expert'
    | 'Master'
    | 'Legend';
  createdAt: Date;
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
