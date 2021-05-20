import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {UsersService} from '../user/services/users.service';
import {ItemsService} from '../items/services/items.service';
import {User} from '../../entities/user.model';
import {Item} from '../../entities/item.model';
import {first, mergeMap} from 'rxjs/operators';

@Injectable()
export class BarterOfferResolver implements Resolve<[User, Item]> {
  constructor(private userService: UsersService,
              private itemService: ItemsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[User, Item]> {
    return forkJoin([
      this.itemService.getById$(route.paramMap.get('id'))
        .pipe(first(),
          mergeMap(item => this.userService.getById$(item.ownerId).pipe(first()))),
      this.itemService.getById$(route.paramMap.get('id')).pipe(first())
    ]);
  }
}
