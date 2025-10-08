// career-types.ts in libs/shared-utils/src/lib/types/career-types.ts

export interface CareerPreference {
  id: number; // Backend returns 'id' as number
  userId: number; // Backend returns number
  fieldId: number; // Backend returns number
  topicId?: number; // Backend returns number
  createdAt: string; // Backend returns ISO string
}
