import Upload from "./Upload";

export default interface Location {
  id?: string;
  name: string;
  address: string;
  company: string;
  coverPhoto?: Upload;
  gallery?: Upload[];
  galleryId?: string;
  addedBy?: string;
  createdAt?: string;
}

export interface CreateLocationParams {
  name: string;
  address: string;
  company: string;
  coverPhoto?: string;
}