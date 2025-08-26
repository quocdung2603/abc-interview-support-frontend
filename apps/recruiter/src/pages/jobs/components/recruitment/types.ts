export interface JobPost {
  id: string;
  title: string;
  position: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  deadline: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  updatedAt: string;
  createdAt: string;
}
