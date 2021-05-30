import {User} from '../../entities/user.model';
import {Item} from '../../entities/item.model';
import {TransactionStatus} from './transaction-status';

export interface TransactionDetails {
  id: string;
  trader: User;
  owner: User;
  traderItem: Item;
  ownerItem: Item;
  status: TransactionStatus;
  offeredDate: Date;
  completenessDate: Date;
}
