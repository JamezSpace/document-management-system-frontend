import { BaseStaffEntity } from './BaseStaff.api';

interface StaffLoginApi extends BaseStaffEntity {
  authProviderId: string;
  media: {
    profilePicUrl: string,
    signatureUrl: string
  };
}

export type { StaffLoginApi };
