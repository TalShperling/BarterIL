import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {UsersService} from '../user/services/users.service';
import {ItemsService} from '../items/services/items.service';
import {concatMap, first, mergeMap} from 'rxjs/operators';
import {getMyTransactionsAndOffers, TransactionsState} from './reducers/transactions.reducer';
import {Store} from '@ngrx/store';
import {getUser, UserState} from '../user/reducers/user.reducer';
import {Transaction} from '../../entities/transaction.model';
import {TransactionDetails} from './transaction-details.model';

@Injectable()
export class UserTransactionsResolver implements Resolve<TransactionDetails[]> {
  constructor(private userService: UsersService,
              private itemService: ItemsService,
              private transactionsStore$: Store<TransactionsState>,
              private userStore$: Store<UserState>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TransactionDetails[]> {
    return this.userStore$.select(getUser)
      .pipe(first(),
        concatMap(user => this.transactionsStore$.select(getMyTransactionsAndOffers(user.id))))
      .pipe(first(), mergeMap((transactions: Transaction[]) =>
          forkJoin(
            transactions.map((transaction: Transaction) =>
              forkJoin({
                id: of(transaction.id),
                trader: this.userService.getById$(transaction.traderId).pipe(first()),
                owner: this.userService.getById$(transaction.ownerId).pipe(first()),
                traderItem: this.itemService.getById$(transaction.traderItemId).pipe(first()),
                ownerItem: this.itemService.getById$(transaction.ownerItemId).pipe(first()),
                status: of(transaction.status),
              }))
          )
        )
      );
  }
}
