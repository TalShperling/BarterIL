import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ButtonsModule, CardsModule, CarouselModule, IconsModule, InputsModule, InputUtilitiesModule, WavesModule } from 'angular-bootstrap-md';
import { AlertsService } from '../services/alerts/alerts.service';
import { EditItemModalComponent } from './components/edit-item-modal/edit-item-modal.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemComponent } from './components/item/item.component';
import { ItemsEffects } from './effects/items.effects';
import { itemsFeatureKey, itemsReducer } from './reducers/items.reducer';
import { ItemsService } from './services/items.service';

@NgModule({
  declarations: [ItemComponent, ItemListComponent, EditItemModalComponent],
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
    CarouselModule,
    WavesModule
  ],
  providers: [ItemsService, AlertsService]
})
export class ItemsModule { }
