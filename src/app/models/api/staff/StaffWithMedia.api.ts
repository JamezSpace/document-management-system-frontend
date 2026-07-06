import { BaseStaffEntity } from './BaseStaff.api';

interface StaffWithMedia extends BaseStaffEntity {
  media: {
    assetRole: string;
    storageProvider: string;
    bucketName: string;
    objectKey: string;
  }; 
}

export type { StaffWithMedia };
