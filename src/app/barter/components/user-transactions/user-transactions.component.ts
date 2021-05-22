import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MDBModalRef, MDBModalService, MdbTableDirective, MdbTablePaginationComponent} from 'angular-bootstrap-md';
import {ActivatedRoute} from '@angular/router';
import {Item} from '../../../../entities/item.model';
import {ItemDetailsModalComponent} from '../../../items/components/item-details-modal/item-details-modal.component';
import {getUser, UserState} from '../../../user/reducers/user.reducer';
import {Store} from '@ngrx/store';
import {getTransaction, TransactionsState} from '../../reducers/transactions.reducer';
import {Transaction} from '../../../../entities/transaction.model';
import {updateTransaction} from '../../actions/transactions.actions';
import {getTransactionItems, ItemsState} from '../../../items/reducers/items.reducer';
import {updateItem} from '../../../items/actions/items.actions';
import {AlertsService} from '../../../services/alerts/alerts.service';
import {first} from 'rxjs/operators';
import firebase from 'firebase';
import {User} from '../../../../entities/user.model';

@Component({
  selector: 'app-user-transactions',
  templateUrl: './user-transactions.component.html',
  styleUrls: ['./user-transactions.component.scss']
})
export class UserTransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;
  elements: any = [];
  previous: any = [];
  headElements = ['Bidder', 'Owner', 'Offered Item', 'Owner Item', 'Action'];
  transactionsElements = [];
  modalRef: MDBModalRef;
  offeredToMeCheck: boolean = false;
  completedTransactionsCheck: boolean = false;
  myOffersCheck: boolean = false;
  currentUser: User;
  maxTableRows: number = 5;

  constructor(private cdRef: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute,
              private modalService: MDBModalService,
              private transactionStore$: Store<TransactionsState>,
              private itemsStore$: Store<ItemsState>,
              private userStore$: Store<UserState>,
              private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((result) => {
      result.data.forEach(transaction =>
        this.elements.push({
          id: transaction.id,
          bidder: transaction.trader,
          owner: transaction.owner,
          offeredItem: transaction.traderItem,
          ownerItem: transaction.ownerItem,
          isCompleted: transaction.isCompleted,
          inProgress: transaction.inProgress
        }));

      this.elements.sort((a, b) => a.isCompleted - b.isCompleted);

      this.transactionsElements = this.elements;
      this.setTableData();
    });

    this.userStore$.select(getUser).subscribe((user: User) => this.currentUser = user);
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxTableRows);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
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

        const transactionIndex = this.elements.indexOf(this.elements.find(element =>
          (element.offeredItem.id === firstItem.id || element.offeredItem.id === secondItem.id) &&
          ((element.ownerItem.id === firstItem.id || element.ownerItem.id === secondItem.id))));
        this.elements[transactionIndex].isCompleted = true;

        this.itemsStore$.dispatch(updateItem({item: firstItem}));
        this.itemsStore$.dispatch(updateItem({item: secondItem}));
        this.updateTransactionStatus(transaction.id);
        this.declineOtherTransactions(firstItem.id, secondItem.id);
        this.alertsService.showSuccessAlert('Barter offer accepted!');
      });
  }

  private declineOtherTransactions(firstItemId: string, secondItemId: string): void {
    this.elements.forEach(element => {
        if (element.ownerItem.id === firstItemId || element.offeredItem.id === firstItemId ||
          element.ownerItem.id === secondItemId || element.offeredItem.id === secondItemId) {
          element.isCompleted = true;
          this.updateTransactionStatus(element.id);
        }
      }
    );
  }

  private updateTransactionStatus(transactionId: string): void {
    this.transactionStore$.select(getTransaction(transactionId)).pipe(first())
      .subscribe((transactionToUpdate: Transaction) => {
        const updatedTransaction = {...transactionToUpdate};
        updatedTransaction.isTransactionCompleted = true;
        updatedTransaction.transactionCompleteDate = firebase.firestore.Timestamp.fromDate(new Date());
        this.transactionStore$.dispatch(updateTransaction({transaction: updatedTransaction}));
      });
  }

  declineOffer(transaction): void {
    this.transactionStore$.select(getTransaction(transaction.id)).pipe(first())
      .subscribe((transactionToUpdate: Transaction) => {
        const updatedTransaction = {...transactionToUpdate};
        updatedTransaction.isTransactionCompleted = true;
        updatedTransaction.transactionCompleteDate = firebase.firestore.Timestamp.fromDate(new Date());
        this.elements.find(element => element.id === transaction.id).isCompleted = true;
        this.transactionStore$.dispatch(updateTransaction({transaction: updatedTransaction}));
        this.alertsService.showErrorAlert('Barter offer was declined!');
      });
  }

  offeredToMeFilter(): void {
    this.offeredToMeCheck = !this.offeredToMeCheck;
    this.myOffersCheck = false;
    this.completedTransactionsCheck = false;
    this.elements = this.transactionsElements;

    if (this.offeredToMeCheck) {
      this.elements = this.elements.filter(transaction => transaction.owner.id === this.currentUser.id);
    }

    this.setTableData();
  }

  myOffersFilter(): void {
    this.myOffersCheck = !this.myOffersCheck;
    this.offeredToMeCheck = false;
    this.completedTransactionsCheck = false;
    this.elements = this.transactionsElements;

    if (this.myOffersCheck) {
      this.elements = this.elements.filter(transaction => transaction.bidder.id === this.currentUser.id);
    }

    this.setTableData();
  }

  completedTransactionsFilter(): void {
    this.completedTransactionsCheck = !this.completedTransactionsCheck;
    this.offeredToMeCheck = false;
    this.myOffersCheck = false;
    this.elements = this.transactionsElements;

    if (this.completedTransactionsCheck) {
      this.elements = this.elements.filter(transaction => transaction.isCompleted);
    }

    this.setTableData();
  }

  private setTableData(): void {
    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }
}