import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Item} from '../../../../entities/item.model';
import {takeUntil} from 'rxjs/operators';
import {ObservableListener} from '../../../components/observable-listener';
import {getItems, ItemsState} from '../../reducers/items.reducer';
import {ItemsModalService} from '../../services/items-modal.service';
import {User} from '../../../../entities/user.model';
import {getUser} from '../../../user/reducers/user.reducer';

@Component({
  selector: 'app-items-management',
  templateUrl: './items-management.component.html',
  styleUrls: ['./items-management.component.scss']
})
export class ItemsManagementComponent extends ObservableListener implements OnInit {
  items$: Observable<Item[]>;
  currentUser$: Observable<User>;
  searchText = '';

  constructor(private store$: Store<ItemsState>,
              private itemsModalService: ItemsModalService) {
    super();
  }

  ngOnInit(): void {
    this.items$ = this.store$.select(getItems).pipe(takeUntil(this.unsubscribeOnDestroy));
    this.currentUser$ = this.store$.select(getUser).pipe(takeUntil(this.unsubscribeOnDestroy));
  }

  deleteItem(item: Item): void {
    this.itemsModalService.deleteItem(item);
  }

  editItem(item: Item): void {
    this.itemsModalService.editItem(item);
  }

  viewItem(item: Item): void {
    this.itemsModalService.viewItem(item);
  }
}
