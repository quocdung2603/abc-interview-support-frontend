// career-types.ts in libs/shared-utils/src/lib/types/career-types.ts

export interface CareerPreference {
  careerPreferenceId: string;
  userId: string;
  fieldId: string;
  topicId?: string;
  createdAt: Date;
}
