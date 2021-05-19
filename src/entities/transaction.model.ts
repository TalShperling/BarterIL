import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface Transaction {
  id: string;
  ownerItemId: string;
  traderItemId: string;
  traderId: string;
  ownerId: string;
  isTransactionCompleted: boolean;
  offerDate: Timestamp;
  transactionCompleteDate: Timestamp;
}
