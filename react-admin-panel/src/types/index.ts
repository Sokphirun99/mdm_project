export interface Device {
  id: string;
  name: string;
  platform: 'android' | 'ios';
  osVersion: string;
  model: string;
  serialNumber: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'pending';
  enrollmentDate: string;
  policies: string[];
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  platform: 'android' | 'ios' | 'both';
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface App {
  id: string;
  name: string;
  packageName: string;
  version: string;
  platform: 'android' | 'ios';
  category: string;
  isRequired: boolean;
  installUrl?: string;
}

export interface Command {
  id: string;
  deviceId: string;
  type: string;
  status: 'pending' | 'sent' | 'completed' | 'failed';
  parameters: Record<string, any>;
  createdAt: string;
  executedAt?: string;
  result?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
