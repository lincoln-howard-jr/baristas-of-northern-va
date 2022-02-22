import Location from "./Location";
import Upload from "./Upload";

export default interface Member {
  id?: string;
  invitedBy?: Member;
  acceptedAt: number;
  memberRole: string;
  memberEmail: string;
  memberPhone: string;
  memberName: string;
  memberLocation: Location;
  profilePicture?: Upload;
  coverPhoto?: Upload;
  bio?: string[];
  employmentStatus?: 'full time' | 'part time' | 'unemployed';
  accomplishments?: string[];
  isNotGrantedInvitePermission: boolean;
}

export enum EmploymentStatusOptions {
  'full time' = 'full time',
  'part time' = 'part time',
  'unemployed' = 'unemployed'
}

export interface MemberUpdate {
  profilePicture?: string;
  coverPhoto?: string;
  bio?: string[];
  employmentStatus?: EmploymentStatusOptions;
  accomplishments?: string[];
  isNotGrantedInvitePermission?: boolean;
}
