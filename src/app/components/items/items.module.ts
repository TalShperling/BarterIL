import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemComponent} from './item/item.component';
import {ItemsService} from '../../services/items/items.service';
import {
  ButtonsModule,
  CardsModule,
  IconsModule,
  InputsModule,
  InputUtilitiesModule,
  WavesModule
} from 'angular-bootstrap-md';
import {ItemListComponent} from './item-list/item-list.component';
import {EditItemModalComponent} from './edit-item-modal/edit-item-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AlertsService} from '../../services/alerts/alerts.service';

@NgModule({
  declarations: [ItemComponent, ItemListComponent, EditItemModalComponent],
  exports: [ItemListComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    InputUtilitiesModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    CardsModule,
    ButtonsModule,
    IconsModule,
    WavesModule
  ],
  providers: [ItemsService, AlertsService]
})
export class ItemsModule { }
