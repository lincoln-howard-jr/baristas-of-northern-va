import Member from "./Member";

export default interface Message {
  isFromMe: boolean;
  otherMember: Member | undefined;
  message: string;
  createdAt: Date;
}
export interface RawMessage {
  fromMember: string;
  toMember: string;
  message: string;
  createdAt: number;
}