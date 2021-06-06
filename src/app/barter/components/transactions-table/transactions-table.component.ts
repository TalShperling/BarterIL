import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MDBModalService, MdbTableDirective, MdbTablePaginationComponent} from 'angular-bootstrap-md';
import {Item} from '../../../../entities/item.model';
import {User} from '../../../../entities/user.model';
import {TransactionStatus} from '../../transaction-status';
import {UserRatingComponent} from '../user-rating/user-rating.component';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;
  @Input() elements: any;
  @Input() headElements;
  @Input() currentUser: User;
  @Output() itemClickEmitter: EventEmitter<Item>;
  @Output() acceptOfferEmitter: EventEmitter<any>;
  @Output() declineOfferEmitter: EventEmitter<any>;
  maxTableRows: number = 5;
  enableAcceptOffer: boolean = false;

  constructor(private cdRef: ChangeDetectorRef,
              private modalService: MDBModalService) {
    this.acceptOfferEmitter = new EventEmitter<any>();
    this.declineOfferEmitter = new EventEmitter<any>();
    this.itemClickEmitter = new EventEmitter<Item>();
  }

  ngOnInit(): void {
    this.enableAcceptOffer = this.acceptOfferEmitter.observers.length > 0;
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
    this.itemClickEmitter.emit(item);
  }

  acceptOffer(transaction): void {
    this.acceptOfferEmitter.emit(transaction);
  }

  declineOffer(transaction): void {
    this.declineOfferEmitter.emit(transaction);
  }

  private setTableData(): void {
    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
  }

  public get transactionStatuses(): typeof TransactionStatus {
    return TransactionStatus;
  }

  rateUser(bidder: User, owner: User) {
    const ratedUser = bidder.id === this.currentUser.id ? owner : bidder;
    const ratingUser = bidder.id !== this.currentUser.id ? owner.id : bidder.id;

    this.modalService.show(UserRatingComponent, {
      data: {
        ratedUser,
        ratingUser
      }
    });
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
