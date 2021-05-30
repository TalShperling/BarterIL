import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, skip, switchMap, tap} from 'rxjs/operators';
import {
  createTransaction,
  createTransactionFail,
  createTransactionSuccess,
  initiateTransactions,
  initiateTransactionsFail,
  initiateTransactionsSuccess,
  updateTransaction,
  updateTransactionFail,
  updateTransactionSuccess
} from '../actions/transactions.actions';
import {TransactionsService} from '../services/transactions.service';
import {TransactionsState} from '../reducers/transactions.reducer';
import {Transaction} from '../../../entities/transaction.model';
import {AlertsService} from '../../services/alerts/alerts.service';

@Injectable()
export class TransactionsEffects {

  initiateTransactions$ = createEffect(() => this.actions$.pipe(
    ofType(initiateTransactions),
    switchMap(() => this.transactionsService.getAll$()
      .pipe(
        map((transactions: Transaction[]) => initiateTransactionsSuccess({transactions})),
        catchError((err) => of(initiateTransactionsFail({message: err})))
      ))
    )
  );

  observeTransactions$ = createEffect(() => this.transactionsService.getAll$().pipe(skip(1),
    tap((transactions: Transaction[]) => this.transactionsService.alertNewTransaction(transactions))
  ), {dispatch: false});

  createTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(createTransaction),
    switchMap(({transaction}) => this.transactionsService.upsert$(transaction)
      .pipe(
        map((newTransaction: Transaction) => createTransactionSuccess({newTransaction})),
        catchError((err) => of(createTransactionFail({message: err})))
      ))
  ));

  updateTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(updateTransaction),
    switchMap(({transaction}) => this.transactionsService.upsert$(transaction)
      .pipe(
        map(() => updateTransactionSuccess({updatedTransaction: transaction})),
        catchError((err) => of(updateTransactionFail({message: err})))
      ))
    )
  );

  transactionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(createTransactionSuccess),
    tap(() => {
      this.alertsService.showSuccessAlert('The deal has sent to the trader');
    })
    ), {dispatch: false}
  );

  transactionFailed$ = createEffect(() => this.actions$.pipe(
    ofType(createTransactionFail),
    tap(() => {
      this.alertsService.showErrorAlert('Transaction is still in progress!');
    })
    ), {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private store$: Store<TransactionsState>,
    private transactionsService: TransactionsService,
    private alertsService: AlertsService
  ) {
  }
}
