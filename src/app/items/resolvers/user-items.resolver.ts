import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {first, mergeMap} from 'rxjs/operators';
import {getUser, UserState} from '../../user/reducers/user.reducer';
import {Store} from '@ngrx/store';
import {getMyItems, ItemsState} from '../reducers/items.reducer';
import {Item} from '../../../entities/item.model';
import {User} from '../../../entities/user.model';

@Injectable()
export class UserItemsResolver implements Resolve<{ ownerId: string, items: Item[] }> {
  constructor(private itemsStore$: Store<ItemsState>,
              private userStore$: Store<UserState>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ ownerId: string, items: Item[] }> {
    return this.userStore$.select(getUser)
      .pipe(first(),
        mergeMap((user: User) => {
          return forkJoin({
            ownerId: of(user.id),
            items: this.itemsStore$.select(getMyItems(user.id)).pipe(first())
          });
        })
      );
  }
}
