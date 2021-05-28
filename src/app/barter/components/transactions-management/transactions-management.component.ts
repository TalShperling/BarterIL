import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Transaction } from 'src/entities/transaction.model';
import { ObservableListener } from '../../../components/observable-listener';
import { initiateTransactions } from '../../actions/transactions.actions';
import { getTransactions, TransactionsState } from '../../reducers/transactions.reducer';

@Component({
  selector: 'app-transactions-management',
  templateUrl: './transactions-management.component.html',
  styleUrls: ['./transactions-management.component.scss']
})
export class TransactionsManagementComponent extends ObservableListener implements OnInit {
  transactions$: Observable<Transaction[]>;
  searchText = '';

  constructor(private store$: Store<TransactionsState>) {
    super();
  }

  ngOnInit(): void {
    this.store$.dispatch(initiateTransactions());
    this.transactions$ = this.store$.select(getTransactions).pipe(takeUntil(this.unsubscribeOnDestroy));
  }
}
