import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {TransactionStatus} from '../app/barter/transaction-status';

export interface Transaction {
  id: string;
  ownerItemId: string;
  traderItemId: string;
  traderId: string;
  ownerId: string;
  offerDate: Timestamp;
  transactionCompleteDate: Timestamp;
  status: TransactionStatus;
  operatedBy: string;
}
