import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ItemAndCategories } from '../../../../entities/item.model';
import { User } from '../../../../entities/user.model';
import { ObservableListener } from '../../../components/observable-listener';
import { getUser } from '../../../user/reducers/user.reducer';
import { getItemsAndCategories, ItemsState } from '../../reducers/items.reducer';
import { ItemsModalService } from '../../services/items-modal.service';

@Component({
  selector: 'app-items-management',
  templateUrl: './items-management.component.html',
  styleUrls: ['./items-management.component.scss']
})
export class ItemsManagementComponent extends ObservableListener implements OnInit {
  items$: Observable<ItemAndCategories[]>;
  currentUser$: Observable<User>;
  searchText = '';

  constructor(private store$: Store<ItemsState>,
              private itemsModalService: ItemsModalService) {
    super();
  }

  ngOnInit(): void {
    this.items$ = this.store$.select(getItemsAndCategories).pipe(takeUntil(this.unsubscribeOnDestroy));
    this.currentUser$ = this.store$.select(getUser).pipe(takeUntil(this.unsubscribeOnDestroy));
  }

  deleteItem(item: ItemAndCategories): void {
    this.itemsModalService.deleteItem(item);
  }

  editItem(item: ItemAndCategories): void {
    this.itemsModalService.editItem(item);
  }

  viewItem(item: ItemAndCategories): void {
    this.itemsModalService.viewItem(item);
  }
}
