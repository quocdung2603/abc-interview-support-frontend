export interface CompanyProfileData {
  companyName: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  description?: string;
  industry: string;
  companySize: string;
}

export interface NotificationSettings {
  emailNewApplication: boolean;
  emailExamComplete: boolean;
  emailSystemUpdate: boolean;
  pushNewApplication: boolean;
  pushExamComplete: boolean;
  pushSystemUpdate: boolean;
}

export interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

export interface PreferenceSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  autoSave: boolean;
  darkMode: boolean;
}

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  isCurrent: boolean;
  lastActivity: string;
}
