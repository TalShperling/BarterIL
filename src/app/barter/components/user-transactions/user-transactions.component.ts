import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MDBModalRef, MDBModalService, MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../../../../entities/item.model';
import { ItemDetailsModalComponent } from '../../../items/components/item-details-modal/item-details-modal.component';
import { getUser, UserState } from '../../../user/reducers/user.reducer';
import { Store } from '@ngrx/store';
import { getTransaction, TransactionsState } from '../../reducers/transactions.reducer';
import { Transaction } from '../../../../entities/transaction.model';
import { updateTransaction } from '../../actions/transactions.actions';
import { getTransactionItems, ItemsState } from '../../../items/reducers/items.reducer';
import { updateItem } from '../../../items/actions/items.actions';
import { AlertsService } from '../../../services/alerts/alerts.service';
import { first } from 'rxjs/operators';
import firebase from 'firebase';
import { User } from '../../../../entities/user.model';
import { TransactionStatus } from '../../transaction-status';
import { Filter } from 'src/entities/filter.model';
import { TransactionAndUsers } from 'src/entities/transaction-and-users';

@Component({
  selector: 'app-user-transactions',
  templateUrl: './user-transactions.component.html',
  styleUrls: ['./user-transactions.component.scss']
})
export class UserTransactionsComponent implements OnInit {
  originalElements: TransactionAndUsers[] = [];
  elements: TransactionAndUsers[] = [];
  headElements = ['Bidder', 'Owner', 'Offered Item', 'Owner Item', 'Action'];
  offeredToMeCheck: boolean = false;
  completedTransactionsCheck: boolean = false;
  myOffersCheck: boolean = false;
  currentUser: User;
  filtersList: Filter<Transaction>[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private transactionStore$: Store<TransactionsState>,
    private itemsStore$: Store<ItemsState>,
    private userStore$: Store<UserState>,
    private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((result) => {
      result.data.forEach((transaction: TransactionAndUsers) =>
        this.elements.push(transaction));

      this.elements.sort((a, b) => a.status - b.status);
      this.originalElements = Object.assign({}, this.elements);
    });

    this.userStore$.select(getUser).subscribe((user: User) => this.currentUser = user);

    this.filtersList.push(
      { func: this.myOffersFilter, text: "My Offers", isActive: this.myOffersCheck },
      { func: this.offeredToMeFilter, text: "Offered To Me", isActive: this.offeredToMeCheck },
      { func: this.completedTransactionsFilter, text: "Completed Transactions", isActive: this.completedTransactionsCheck }
    )
  }

  acceptOffer(transaction): void {
    this.itemsStore$.select(getTransactionItems(transaction.ownerItem.id, transaction.offeredItem.id)).pipe(first())
      .subscribe((items: Item[]) => {
        const firstItem: Item = { ...items[0] };
        const secondItem: Item = { ...items[1] };

        const firstItemOwnerId = firstItem.ownerId;
        firstItem.ownerId = secondItem.ownerId;
        secondItem.ownerId = firstItemOwnerId;

        const transactionIndex = this.elements.indexOf(this.elements.find(element =>
          (element.traderItem.id === firstItem.id || element.traderItem.id === secondItem.id) &&
          ((element.ownerItem.id === firstItem.id || element.ownerItem.id === secondItem.id))));
        this.elements[transactionIndex].status = TransactionStatus.COMPLETED;

        this.itemsStore$.dispatch(updateItem({ item: firstItem }));
        this.itemsStore$.dispatch(updateItem({ item: secondItem }));
        this.updateTransactionStatus(transaction.id, TransactionStatus.COMPLETED);
        this.declineOtherTransactions(firstItem.id, secondItem.id, transaction.id);
        this.alertsService.showSuccessAlert('Barter offer accepted!');
      });
  }

  private declineOtherTransactions(firstItemId: string, secondItemId: string, currentTransactionId: string): void {
    this.elements.forEach(element => {
      if ((element.ownerItem.id === firstItemId || element.traderItem.id === firstItemId ||
        element.ownerItem.id === secondItemId || element.traderItem.id === secondItemId) && element.id !== currentTransactionId) {
        element.status = TransactionStatus.CANCELED;
        this.updateTransactionStatus(element.id, TransactionStatus.CANCELED);
      }
    }
    );
  }

  private updateTransactionStatus(transactionId: string, transactionStatus: TransactionStatus): void {
    this.transactionStore$.select(getTransaction(transactionId)).pipe(first())
      .subscribe((transactionToUpdate: Transaction) => {
        const updatedTransaction = { ...transactionToUpdate };
        updatedTransaction.status = transactionStatus;
        updatedTransaction.transactionCompleteDate = firebase.firestore.Timestamp.fromDate(new Date());
        this.transactionStore$.dispatch(updateTransaction({ transaction: updatedTransaction }));
      });
  }

  declineOffer(transaction): void {
    this.transactionStore$.select(getTransaction(transaction.id)).pipe(first())
      .subscribe((transactionToUpdate: Transaction) => {
        const updatedTransaction = { ...transactionToUpdate };
        updatedTransaction.status = TransactionStatus.CANCELED;
        updatedTransaction.transactionCompleteDate = firebase.firestore.Timestamp.fromDate(new Date());
        this.elements.find(element => element.id === transaction.id).status = TransactionStatus.CANCELED;
        this.transactionStore$.dispatch(updateTransaction({ transaction: updatedTransaction }));
        this.alertsService.showErrorAlert('Barter offer was declined!');
      });
  }

  offeredToMeFilter(): void {
    this.offeredToMeCheck = !this.offeredToMeCheck;
    this.myOffersCheck = false;
    this.completedTransactionsCheck = false;
    this.elements = Object.assign({}, this.originalElements);

    if (this.offeredToMeCheck) {
      this.elements = this.elements.filter(transaction => transaction.owner.id === this.currentUser.id);
    }
  }

  myOffersFilter(): void {
    this.myOffersCheck = !this.myOffersCheck;
    this.offeredToMeCheck = false;
    this.completedTransactionsCheck = false;
    this.elements = Object.assign({}, this.originalElements);

    if (this.myOffersCheck) {
      this.elements = this.elements.filter(transaction => transaction.trader.id === this.currentUser.id);
    }
  }

  completedTransactionsFilter(): void {
    this.completedTransactionsCheck = !this.completedTransactionsCheck;
    this.offeredToMeCheck = false;
    this.myOffersCheck = false;
    this.elements = Object.assign({}, this.originalElements);

    if (this.completedTransactionsCheck) {
      this.elements = this.elements.filter(transaction => transaction.status === TransactionStatus.COMPLETED);
    }
  }

  public get transactionStatuses(): typeof TransactionStatus {
    return TransactionStatus;
  }
}
