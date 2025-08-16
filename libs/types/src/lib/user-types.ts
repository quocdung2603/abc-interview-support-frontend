// user-types.ts in libs/shared-utils/src/lib/types/user-types.ts

export interface Role {
  roleId: string;
  roleName: 'Student' | 'Recruiter' | 'Admin';
  description?: string;
}

export interface User {
  userId: string;
  roleId: string;
  email: string;
  passWord: string; // Encrypted
  fullName?: string;
  dateOfBirth?: Date;
  address?: string;
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

export interface EloHistory {
  eloHistoryId: string;
  userId: string;
  action: string;
  points: number;
  description?: string;
  createdAt: Date;
}
