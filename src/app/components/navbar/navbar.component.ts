import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../entities/user.model';
import { select, Store } from '@ngrx/store';
import { getUser, UserState } from '../../user/reducers/user.reducer';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { logout } from '../../user/actions/user.actions';
import { TransactionsService } from '../../barter/services/transactions.service';
import { Alert } from './alert.model';
import { UsersService } from '../../user/services/users.service';
import { TransactionStatus } from '../../barter/transaction-status';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  signInUser$: Observable<User>;
  userFullName$: Observable<string>;
  user: User;
  alerts$: Observable<Alert[]>;
  displayNotification: boolean = false;

  constructor(private router: Router,
              private store: Store<UserState>,
              private transactionService: TransactionsService,
              private userService: UsersService) {
  }

  ngOnInit(): void {
    this.signInUser$ = this.store.pipe(select(getUser)).pipe(tap(user => this.user = user));
    this.userFullName$ = this.signInUser$.pipe(map(user => user ? `${user.firstName} ${user.lastName}` : 'no name'));
    this.alerts$ = this.transactionService.getNewTransactions$().pipe(
      withLatestFrom(this.userService.getAll$()),
      map(([transactions, users]) => transactions.map(transaction => ({
        transactionId: transaction.id,
        description: this.getDescription(transaction.status),
        trader: users.find(user => user.id === transaction.operatedBy),
        date: !!transaction.transactionCompleteDate ? transaction.transactionCompleteDate.toDate() : transaction.offerDate.toDate()
      })))
    );
  }

  clearAlerts(): void {
    this.transactionService.clearNewTransactions$();
  }

  private getDescription(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.CANCELED:
        return ' transaction canceled by ';
      case TransactionStatus.COMPLETED:
        return ' transaction completed  by ';
      case TransactionStatus.OPEN:
        return ' new transaction offer by ';
    }
  }

  logout(): void {
    this.store.dispatch(logout());
  }
}
