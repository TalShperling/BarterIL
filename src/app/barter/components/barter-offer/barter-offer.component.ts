import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../../../entities/user.model';
import {Item} from '../../../../entities/item.model';
import {getMyItems, ItemsState} from '../../../items/reducers/items.reducer';
import {concatMap, takeUntil} from 'rxjs/operators';
import {ObservableListener} from '../../../components/observable-listener';
import {Store} from '@ngrx/store';
import {AuthenticateService} from '../../../user/services/authentication.service';
import {ItemComponent} from '../../../items/components/item/item.component';
import {getMyTransactions, TransactionsState} from '../../reducers/transactions.reducer';
import {createTransaction, createTransactionFail, initiateTransactions} from '../../actions/transactions.actions';
import {Transaction} from '../../../../entities/transaction.model';
import firebase from 'firebase';
import {getUser, UserState} from '../../../user/reducers/user.reducer';

@Component({
  selector: 'app-barter-offer',
  templateUrl: './barter-offer.component.html',
  styleUrls: ['./barter-offer.component.scss']
})
export class BarterOfferComponent extends ObservableListener implements OnInit {
  user: User;
  offerItem: Item;
  myItems: Item[] = [];
  selectedItem: Item;
  private myTransactions: Transaction[];
  @ViewChild('myItem') myItem!: ItemComponent;


  constructor(private activatedRoute: ActivatedRoute,
              private store$: Store<ItemsState>,
              private userStore$: Store<UserState>,
              private transactionsStore$: Store<TransactionsState>,
              private authService: AuthenticateService) {
    super();
  }

  ngOnInit(): void {
    this.transactionsStore$.dispatch(initiateTransactions());
    this.userStore$.select(getUser).pipe(concatMap(user => this.transactionsStore$.select(getMyTransactions(user.id))))
      .subscribe(myTransactions => {
        this.myTransactions = myTransactions;
      });

    this.activatedRoute.data.subscribe((result) => {
      this.user = result.data[0];
      this.offerItem = result.data[1];
      this.userStore$.select(getUser).pipe(takeUntil(this.unsubscribeOnDestroy),
        concatMap(user => this.store$.select(getMyItems(user.id))))
        .subscribe(items => {
          this.myItems = items;
          this.selectedItem = items[0];
        });
    });
  }

  selectItem(item: Item) {
    this.selectedItem = item;
    this.myItem.changeImageSrc(this.selectedItem.pictureUrls[0]);
  }

  offerDeal(): void {
    const invalidTransactions: Transaction[] = this.myTransactions.filter(currentTransaction => !currentTransaction.isTransactionCompleted
      && currentTransaction.ownerId === this.offerItem.ownerId && currentTransaction.ownerItemId === this.offerItem.id
      && currentTransaction.traderItemId === this.selectedItem.id);

    if (invalidTransactions.length > 0) {
      this.transactionsStore$.dispatch(createTransactionFail({message: 'Transaction failed'}));
    } else {
      this.createTransaction();
    }
  }

  private createTransaction(): void {
    const transaction: Transaction = {
      isTransactionCompleted: false, id: '', traderId: this.authService.getUserFromLocalStorage().id,
      ownerId: this.user.id, ownerItemId: this.offerItem.id, traderItemId: this.selectedItem.id,
      offerDate: firebase.firestore.Timestamp.fromDate(new Date()),
      transactionCompleteDate: null,
      inProgress: false
    };

    this.transactionsStore$.dispatch(createTransaction({transaction}));
  }
}
