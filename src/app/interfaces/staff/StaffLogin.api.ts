import { BaseStaffEntity } from './BaseStaff.api';

interface StaffLoginApi extends BaseStaffEntity {
  authProviderId: string;
  media: {
    assetRole: string | null;
    storageProvider: string | null;
    bucketName: string | null;
    objectKey: string | null;
  };
}

export type { StaffLoginApi };
