import { Component, OnInit, ViewChild } from '@angular/core';
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
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-transactions-management',
  templateUrl: './transactions-management.component.html',
  styleUrls: ['./transactions-management.component.scss']
})
export class TransactionsManagementComponent implements OnInit {
  elements$: BehaviorSubject<any>;
  headElements = ['Bidder', 'Owner', 'Offered Item', 'Owner Item', 'Status', 'Offered date', 'Completeness date', 'Action'];
  transactionsElements = [];
  modalRef: MDBModalRef;
  completedTransactionsCheck: boolean = false;
  currentUser: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: MDBModalService,
    private transactionStore$: Store<TransactionsState>,
    private userStore$: Store<UserState>,
    private alertsService: AlertsService) {
    this.elements$ = new BehaviorSubject<any>([]);
  }

  ngOnInit() {
    let elementsToInsert: any[] = [];
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

  declineOffer(transaction): void {
    this.transactionStore$.select(getTransaction(transaction.id)).pipe(first())
      .subscribe((transactionToUpdate: Transaction) => {
        const updatedTransaction = { ...transactionToUpdate };
        updatedTransaction.status = TransactionStatus.CANCELED;
        updatedTransaction.transactionCompleteDate = firebase.firestore.Timestamp.fromDate(new Date());
        updatedTransaction.operatedBy = this.currentUser.id;
        this.elements$.value.find(element => element.id === transaction.id).status = TransactionStatus.CANCELED;
        this.elements$.value.find(element => element.id === transaction.id).completenessDate = new Date();
        this.transactionStore$.dispatch(updateTransaction({ transaction: updatedTransaction }));
        this.alertsService.showErrorAlert('Barter offer was declined!');
      });
  }

  completedTransactionsFilter(): void {
    this.completedTransactionsCheck = !this.completedTransactionsCheck;
    this.elements$.next(this.transactionsElements);

    if (this.completedTransactionsCheck) {
      this.elements$.next(this.elements$.value.filter(transaction => transaction.status === TransactionStatus.COMPLETED));
    }
  }
}
