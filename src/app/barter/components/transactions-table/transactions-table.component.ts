import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @Output() onDeclineOffer: EventEmitter<TransactionAndUsers>;
  @Output() onAcceptOffer?: EventEmitter<TransactionAndUsers>;
  @Input() headElements: string[];
  @Input() elements: TransactionAndUsers[];
  @Input() filtersList: Filter<TransactionAndUsers>[];
  @Input() currentUser?: User;
  modalRef: MDBModalRef;
  maxTableRows: number = 5;

  constructor(private cdRef: ChangeDetectorRef,
    private modalService: MDBModalService,
    private transactionStore$: Store<TransactionsState>,
    private alertsService: AlertsService) {
    this.onDeclineOffer = new EventEmitter<TransactionAndUsers>();
    this.onAcceptOffer = new EventEmitter<TransactionAndUsers>();
  }

  ngOnInit() {
    this.elements.sort((a, b) => a.status - b.status);
    this.setTableData();
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

  acceptOffer(transaction: TransactionAndUsers): void {
    this.onAcceptOffer.emit(transaction);
    this.setTableData();
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

      this.setTableData();
  }

  private setTableData(): void {
    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
  }


  public get transactionStatuses(): typeof TransactionStatus {
    return TransactionStatus;
  }
}
