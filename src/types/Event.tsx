import Location from "./Location";
import Member from "./Member"

export interface RawEvent {
  id: string;
  createdAt: number;
  member: string;
  galleryId: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventTime: string;
  eventLocation?: string;
  eventAddress?: string;
}
export interface Event {
  id: string;
  createdAt: Date;
  member: Member;
  galleryId: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventTime: string;
  eventLocation?: Location;
  eventAddress?: string;
}
export interface CreateEventParams {
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventTime: string;
  eventLocation?: string;
  eventAddress?: string;
}