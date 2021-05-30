import {User} from '../../../entities/user.model';

export interface Alert {
  transactionId: string;
  description: string;
  trader: User;
  date: Date;
}
