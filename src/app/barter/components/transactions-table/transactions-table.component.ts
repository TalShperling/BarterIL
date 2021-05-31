import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnChanges, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @Input() elements: any;
  @Input() headElements;
  @Input() currentUser: User;
  @Output() onItemClick: EventEmitter<Item>;
  @Output() onAcceptOffer: EventEmitter<any>;
  @Output() onDeclineOffer: EventEmitter<any>;
  maxTableRows: number = 5;

  constructor(private cdRef: ChangeDetectorRef) {
    this.onAcceptOffer = new EventEmitter<any>();
    this.onDeclineOffer = new EventEmitter<any>();
    this.onItemClick = new EventEmitter<Item>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setTableData();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxTableRows);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  showItemDetails(item: Item): void {
    this.onItemClick.emit(item);
  }

  acceptOffer(transaction): void {
    this.onAcceptOffer.emit(transaction);
  }

  declineOffer(transaction): void {
    this.onDeclineOffer.emit(transaction);
  }

  private setTableData(): void {
    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
  }

  public get transactionStatuses(): typeof TransactionStatus {
    return TransactionStatus;
  }

  getStatusDescription(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.OPEN:
        return 'Open';
      case TransactionStatus.COMPLETED:
        return 'Completed';
      case TransactionStatus.CANCELED:
        return 'Canceled';
    }
  }
}
