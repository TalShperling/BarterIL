import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemComponent} from './components/item/item.component';
import {ItemsService} from './services/items.service';
import {
  BadgeModule,
  ButtonsModule,
  CardsModule,
  CarouselModule,
  IconsModule,
  InputsModule,
  InputUtilitiesModule,
  WavesModule
} from 'angular-bootstrap-md';
import {ItemListComponent} from './components/item-list/item-list.component';
import {EditItemModalComponent} from './components/edit-item-modal/edit-item-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {AlertsService} from '../services/alerts/alerts.service';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {itemsFeatureKey, itemsReducer} from './reducers/items.reducer';
import {ItemsEffects} from './effects/items.effects';
import {ItemsManagementComponent} from './components/items-management/items-management.component';
import {ItemsModalService} from './services/items-modal.service';
import {ItemDetailsModalComponent} from './components/item-details-modal/item-details-modal.component';
import {CategoriesService} from './services/categories.service';
import {ItemsTextFilterPipe} from '../pipes/items-text-filter.pipe';
import {ItemsCategoryFilterPipe} from '../pipes/items-category-filter.pipe';
import {UserViewsService} from './services/user-views.service';
import {UserItemsComponent} from './components/user-items/user-items.component';
import {UserItemsResolver} from './resolvers/user-items.resolver';
import { RecommendationService } from './services/recommendation.service';

@NgModule({
  declarations: [
    ItemComponent,
    ItemListComponent,
    EditItemModalComponent,
    ItemDetailsModalComponent,
    ItemsManagementComponent,
    ItemsTextFilterPipe,
    ItemsCategoryFilterPipe,
    UserItemsComponent
  ],
  exports: [ItemListComponent, ItemComponent],
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature(itemsFeatureKey, itemsReducer),
    EffectsModule.forFeature([ItemsEffects]),
    ReactiveFormsModule,
    InputsModule,
    InputUtilitiesModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CardsModule,
    BadgeModule,
    ButtonsModule,
    IconsModule,
    CarouselModule,
    WavesModule
  ],
  providers: [
    CategoriesService,
    ItemsService,
    AlertsService,
    ItemsModalService,
    UserViewsService,
    UserItemsResolver,
    RecommendationService
  ]
})
export class ItemsModule {
}
