import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Item} from '../../../../entities/item.model';
import {first, mergeMap, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {User} from '../../../../entities/user.model';
import {getUser, UserState} from '../../../user/reducers/user.reducer';
import {Store} from '@ngrx/store';
import {ItemsModalService} from '../../services/items-modal.service';
import {getMyItems, ItemsState} from '../../reducers/items.reducer';
import {ObservableListener} from '../../../components/observable-listener';
import {RatingService} from '../../../barter/services/rating.service';
import {Rating} from '../../../../entities/rating.model';

@Component({
  selector: 'app-user-items',
  templateUrl: './user-items.component.html',
  styleUrls: ['./user-items.component.scss']
})
export class UserItemsComponent extends ObservableListener implements OnInit {
  items: Item[] = [];
  currentUser$: Observable<User>;
  searchText: string;
  ratings: Rating[];

  constructor(private activatedRoute: ActivatedRoute,
              private userStore$: Store<UserState>,
              private itemStore$: Store<ItemsState>,
              private ratingService: RatingService,
              private itemsModalService: ItemsModalService) {
    super();
  }

  ngOnInit(): void {
    this.ratingService.getAll$().pipe(first()).subscribe(ratings => {
      this.ratings = ratings;
    });
    this.currentUser$ = this.userStore$.select(getUser).pipe(first());
    this.activatedRoute.data.pipe(first(),
      mergeMap((result: { data: { ownerId: string, items: Item[] } }) => {
        this.items = result.data.items;
        return this.itemStore$.select(getMyItems(result.data.ownerId)).pipe(takeUntil(this.unsubscribeOnDestroy));
      }))
      .subscribe((items: Item[]) => this.items = items);
  }

  deleteItem(itemToDelete: Item): void {
    this.itemsModalService.deleteItem(itemToDelete);
  }

  viewItem(item: Item): void {
    this.itemsModalService.viewItemInWatchMode(item);
  }

  editItem(item: Item): void {
    this.itemsModalService.editItem(item);
  }

  filterRatingsByOwner(ownerId: string, ratings: Rating[]) {
    return ratings && ratings.length ? ratings.filter(rating => rating.ratedUser === ownerId) : [];
  }
}
