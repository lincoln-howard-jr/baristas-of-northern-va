import Member from "./Member";

export default interface Invite {
  id?: string;
  invitedBy?: Member | string;
  validUntil?: number;
  memberName: string;
  memberLocation: Location | string;
  memberEmail: string;
  memberPhone: string;
  memberRole: string;
}