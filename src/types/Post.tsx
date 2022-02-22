import Member from "./Member";

export default interface Post {
  id: string;
  content: string;
  parent?: string;
  createdAt: Date;
  member: Member;
}