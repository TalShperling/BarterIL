import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../../../entities/user.model';
import {Item} from '../../../../entities/item.model';
import {getMyItems, ItemsState} from '../../../items/reducers/items.reducer';
import {concatMap, first, takeUntil, tap} from 'rxjs/operators';
import {ObservableListener} from '../../../components/observable-listener';
import {Store} from '@ngrx/store';
import {AuthenticateService} from '../../../user/services/authentication.service';
import {ItemComponent} from '../../../items/components/item/item.component';
import {getMyTransactions, TransactionsState} from '../../reducers/transactions.reducer';
import {createTransaction, createTransactionFail, initiateTransactions} from '../../actions/transactions.actions';
import {Transaction} from '../../../../entities/transaction.model';
import firebase from 'firebase';
import {getUser, UserState} from '../../../user/reducers/user.reducer';
import {TransactionStatus} from '../../transaction-status';
import {Rating} from '../../../../entities/rating.model';
import {RatingService} from '../../services/rating.service';

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
  currentUser: User;
  private myTransactions: Transaction[];
  @ViewChild('myItem') myItem!: ItemComponent;
  ratings: Rating[];


  constructor(private activatedRoute: ActivatedRoute,
              private store$: Store<ItemsState>,
              private userStore$: Store<UserState>,
              private transactionsStore$: Store<TransactionsState>,
              private ratingService: RatingService,
              private authService: AuthenticateService) {
    super();
  }

  ngOnInit(): void {
    this.ratingService.getAll$().pipe(first()).subscribe(ratings => {
      this.ratings = ratings;
    });
    this.transactionsStore$.dispatch(initiateTransactions());
    this.userStore$.select(getUser).pipe(tap(user => this.currentUser = user),
      concatMap(user => this.transactionsStore$.select(getMyTransactions(user.id)).pipe(first())))
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
    const invalidTransactions: Transaction[] = this.myTransactions
      .filter(currentTransaction => (currentTransaction.status !== TransactionStatus.COMPLETED
        && currentTransaction.status !== TransactionStatus.CANCELED)
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
      status: TransactionStatus.OPEN, id: '', traderId: this.authService.getUserFromLocalStorage().id,
      ownerId: this.user.id, ownerItemId: this.offerItem.id, traderItemId: this.selectedItem.id,
      offerDate: firebase.firestore.Timestamp.fromDate(new Date()),
      transactionCompleteDate: null,
      operatedBy: this.currentUser.id
    };

    this.transactionsStore$.dispatch(createTransaction({transaction}));
  }

  filterRatingsByOwner(ownerId: string, ratings: Rating[]) {
    return ratings && ratings.length ? ratings.filter(rating => rating.ratedUser === ownerId) : [];
  }
}
