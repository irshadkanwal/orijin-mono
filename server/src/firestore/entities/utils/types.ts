import { collectionKeys } from "./DbMappingUtils";
import { ObjectId } from "./ObjectId";

export interface IUserInfo {
  displayName?: string | null;
  email: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  providerId?: string;
  uid: string;
}
export class ObjectIdUser extends ObjectId {
    constructor(id: string, email: string) {
      super(id, collectionKeys.platformusers);
      this.email = email;
    }
  }