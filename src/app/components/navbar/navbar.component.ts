import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../../entities/user.model';
import {select, Store} from '@ngrx/store';
import {getUser, UserState} from '../../user/reducers/user.reducer';
import {forkJoin, Observable, of} from 'rxjs';
import {first, map, mergeMap, tap} from 'rxjs/operators';
import {logout} from '../../user/actions/user.actions';
import {Transaction} from '../../../entities/transaction.model';
import {TransactionsService} from '../../barter/services/transactions.service';
import {Alert} from './alert.model';
import {UsersService} from '../../user/services/users.service';
import {TransactionStatus} from '../../barter/transaction-status';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  signInUser$: Observable<User>;
  userFullName$: Observable<string>;
  transactions$: Observable<Transaction[]>;
  user: User;
  alerts: Alert[] = [];
  displayNotification: boolean = false;

  constructor(private router: Router,
              private store: Store<UserState>,
              private transactionService: TransactionsService,
              private userService: UsersService) {
  }

  ngOnInit(): void {
    this.signInUser$ = this.store.pipe(select(getUser)).pipe(tap(user => this.user = user));
    this.userFullName$ = this.signInUser$.pipe(map(user => user ? `${user.firstName} ${user.lastName}` : 'no name'));
    this.createAlerts();
  }

  private createAlerts(): void {
    this.transactions$ = this.transactionService.getNewTransactions$();
    this.transactionService.getNewTransactions$().pipe(mergeMap((transactions: Transaction[]) =>
      forkJoin(
        transactions.map((transaction: Transaction) => forkJoin({
          transactionId: of(transaction.id),
          description: of(this.getDescription(transaction.status)),
          trader: this.userService.getById$(transaction.operatedBy).pipe(first()),
          date: of(!!transaction.transactionCompleteDate ? transaction.transactionCompleteDate.toDate() : transaction.offerDate.toDate())
        })))
    )).subscribe((alerts: Alert[]) => {
      this.alerts = alerts.sort((a: Alert, b: Alert) => b.date.getTime() - a.date.getTime());

      if (alerts.length) {
        this.displayNotification = true;
      }
    });
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

  hideAlerts(): void {
    this.displayNotification = false;
  }

  logout(): void {
    this.store.dispatch(logout());
  }
}
