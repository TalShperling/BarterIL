import {Component, OnInit} from '@angular/core';
import {MDBModalRef, MDBModalService} from 'angular-bootstrap-md';
import {ActivatedRoute} from '@angular/router';
import {Item} from '../../../../entities/item.model';
import {ItemDetailsModalComponent} from '../../../items/components/item-details-modal/item-details-modal.component';
import {getUser, UserState} from '../../../user/reducers/user.reducer';
import {Store} from '@ngrx/store';
import {getTransaction, getTransactions, TransactionsState} from '../../reducers/transactions.reducer';
import {Transaction} from '../../../../entities/transaction.model';
import {updateTransaction} from '../../actions/transactions.actions';
import {getTransactionItems, ItemsState} from '../../../items/reducers/items.reducer';
import {updateItem} from '../../../items/actions/items.actions';
import {AlertsService} from '../../../services/alerts/alerts.service';
import {first} from 'rxjs/operators';
import firebase from 'firebase';
import {User} from '../../../../entities/user.model';
import {TransactionStatus} from '../../transaction-status';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-user-transactions',
  templateUrl: './user-transactions.component.html',
  styleUrls: ['./user-transactions.component.scss']
})
export class UserTransactionsComponent implements OnInit {
  elements$: BehaviorSubject<any>;
  headElements = ['Bidder', 'Owner', 'Offered Item', 'Owner Item', 'Status', 'Offered date', 'Completeness date', 'Action'];
  transactionsElements = [];
  modalRef: MDBModalRef;
  offeredToMeCheck: boolean = false;
  completedTransactionsCheck: boolean = false;
  myOffersCheck: boolean = false;
  currentUser: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: MDBModalService,
    private transactionStore$: Store<TransactionsState>,
    private itemsStore$: Store<ItemsState>,
    private userStore$: Store<UserState>,
    private alertsService: AlertsService) {
    this.elements$ = new BehaviorSubject<any>([]);
  }

  ngOnInit(): void {
    const elementsToInsert: any[] = [];
    this.activatedRoute.data.subscribe((result) => {
      result.data.forEach(transaction =>
        elementsToInsert.push({
          id: transaction.id,
          bidder: transaction.trader,
          owner: transaction.owner,
          offeredItem: transaction.traderItem,
          ownerItem: transaction.ownerItem,
          status: transaction.status,
          offeredDate: transaction.offeredDate,
          completenessDate: transaction.completenessDate
        }));

      elementsToInsert.sort((a, b) => a.status - b.status);

      this.elements$.next(elementsToInsert);

      this.transactionsElements = elementsToInsert;
    });

    this.userStore$.select(getUser).subscribe((user: User) => this.currentUser = user);
  }

  showItemDetails(item: Item): void {
    this.modalRef = this.modalService.show(ItemDetailsModalComponent, {
      data: {
        item,
        isWatchMode: true
      },
      class: 'modal-lg'
    });
  }

  acceptOffer(transaction): void {
    this.itemsStore$.select(getTransactionItems(transaction.ownerItem.id, transaction.offeredItem.id)).pipe(first())
      .subscribe((items: Item[]) => {
        const firstItem: Item = {...items[0]};
        const secondItem: Item = {...items[1]};

        const firstItemOwnerId = firstItem.ownerId;
        firstItem.ownerId = secondItem.ownerId;
        secondItem.ownerId = firstItemOwnerId;

        const transactionIndex = this.elements$.value.indexOf(this.elements$.value.find(element =>
          (element.offeredItem.id === firstItem.id || element.offeredItem.id === secondItem.id) &&
          ((element.ownerItem.id === firstItem.id || element.ownerItem.id === secondItem.id))));

        const newElements = this.elements$.value;
        newElements[transactionIndex].status = TransactionStatus.COMPLETED;
        this.elements$.next(newElements);


        this.itemsStore$.dispatch(updateItem({item: firstItem}));
        this.itemsStore$.dispatch(updateItem({item: secondItem}));
        this.updateTransactionStatus(transaction.id, TransactionStatus.COMPLETED);
        this.declineElementsTransactions(firstItem.id, secondItem.id, transaction.id);
        this.declineOtherTransactions(firstItem.id, secondItem.id, transaction.id);
        this.alertsService.showSuccessAlert('Barter offer accepted!');
      });
  }

  private declineElementsTransactions(firstItemId: string, secondItemId: string, currentTransactionId: string): void {
    this.elements$.value.forEach((element: any, index: number) => {
        if ((element.ownerItem.id === firstItemId || element.offeredItem.id === firstItemId ||
          element.ownerItem.id === secondItemId || element.offeredItem.id === secondItemId) && element.id !== currentTransactionId
          && element.status === TransactionStatus.OPEN) {

          const newElements = this.elements$.value;
          newElements[index].status = TransactionStatus.CANCELED;
          this.elements$.next(newElements);
        }
      }
    );
  }

  private declineOtherTransactions(firstItemId: string, secondItemId: string, currentTransactionId: string): void {
    this.transactionStore$.select(getTransactions).pipe(first()).subscribe((transactions: Transaction[]) => {
      transactions.forEach((transaction: Transaction) => {
          if ((transaction.ownerItemId === firstItemId || transaction.traderItemId === firstItemId ||
            transaction.ownerItemId === secondItemId || transaction.traderItemId === secondItemId)
            && transaction.id !== currentTransactionId
            && transaction.status === TransactionStatus.OPEN) {
            this.updateTransactionStatus(transaction.id, TransactionStatus.CANCELED);
          }
        }
      );
    });
  }

  private updateTransactionStatus(transactionId: string, transactionStatus: TransactionStatus): void {
    this.transactionStore$.select(getTransaction(transactionId)).pipe(first())
      .subscribe((transactionToUpdate: Transaction) => {
        const updatedTransaction = {...transactionToUpdate};
        updatedTransaction.status = transactionStatus;
        updatedTransaction.operatedBy = this.currentUser.id;
        updatedTransaction.transactionCompleteDate = firebase.firestore.Timestamp.fromDate(new Date());
        this.transactionStore$.dispatch(updateTransaction({transaction: updatedTransaction}));
      });
  }

  declineOffer(transaction): void {
    this.transactionStore$.select(getTransaction(transaction.id)).pipe(first())
      .subscribe((transactionToUpdate: Transaction) => {
        const updatedTransaction = {...transactionToUpdate};
        updatedTransaction.status = TransactionStatus.CANCELED;
        updatedTransaction.transactionCompleteDate = firebase.firestore.Timestamp.fromDate(new Date());
        updatedTransaction.operatedBy = this.currentUser.id;

        const newElements = this.elements$.value;

        newElements.find(element => element.id === transaction.id).status = TransactionStatus.CANCELED;
        newElements.find(element => element.id === transaction.id).completenessDate = new Date();


        this.elements$.next(newElements);

        this.transactionStore$.dispatch(updateTransaction({transaction: updatedTransaction}));
        this.alertsService.showErrorAlert('Barter offer was declined!');
      });
  }

  offeredToMeFilter(): void {
    this.offeredToMeCheck = !this.offeredToMeCheck;
    this.myOffersCheck = false;
    this.completedTransactionsCheck = false;
    this.elements$.next(this.transactionsElements);

    if (this.offeredToMeCheck) {
      this.elements$.next(this.elements$.value.filter(transaction => transaction.owner.id === this.currentUser.id));
    }
  }

  myOffersFilter(): void {
    this.myOffersCheck = !this.myOffersCheck;
    this.offeredToMeCheck = false;
    this.completedTransactionsCheck = false;
    this.elements$.next(this.transactionsElements);

    if (this.myOffersCheck) {
      this.elements$.next(this.elements$.value.filter(transaction => transaction.bidder.id === this.currentUser.id));
    }
  }

  completedTransactionsFilter(): void {
    this.completedTransactionsCheck = !this.completedTransactionsCheck;
    this.offeredToMeCheck = false;
    this.myOffersCheck = false;
    this.elements$.next(this.transactionsElements);

    if (this.completedTransactionsCheck) {
      this.elements$.next(this.elements$.value.filter(transaction => transaction.status === TransactionStatus.COMPLETED));
    }
  }
}
