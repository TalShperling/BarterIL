import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './components/item/item.component';
import { ItemsService } from './services/items.service';
import {
  CardsModule, IconsModule, ButtonsModule, WavesModule, InputsModule, InputUtilitiesModule
} from 'angular-bootstrap-md';
import { ItemListComponent } from './components/item-list/item-list.component';
import { EditItemModalComponent } from './components/edit-item-modal/edit-item-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertsService } from '../services/alerts/alerts.service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { itemsFeatureKey, itemsReducer } from './reducers/items.reducer';
import { ItemsEffects } from './effects/items.effects';
import { ItemDetailsModalComponent } from './components/item-details-modal/item-details-modal.component';

@NgModule({
  declarations: [ItemComponent, ItemListComponent, EditItemModalComponent, ItemDetailsModalComponent],
  exports: [ItemListComponent],
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
    CardsModule,
    ButtonsModule,
    IconsModule,
    WavesModule
  ],
  providers: [ItemsService, AlertsService]
})
export class ItemsModule { }
