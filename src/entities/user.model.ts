import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthday: Timestamp;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
}
