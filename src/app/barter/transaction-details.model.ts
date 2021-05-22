import {User} from '../../entities/user.model';
import {Item} from '../../entities/item.model';

export interface TransactionDetails {
  id: string;
  trader: User;
  owner: User;
  traderItem: Item;
  ownerItem: Item;
  isCompleted: boolean;
}
