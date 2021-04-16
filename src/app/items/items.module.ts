import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './components/item/item.component';
import { ItemsService } from './services/items.service';
import {
  CardsModule, IconsModule, WavesModule} from 'angular-bootstrap-md';
import { ItemListComponent } from './components/item-list/item-list.component';

@NgModule({
  declarations: [ItemComponent, ItemListComponent],
  exports: [ItemComponent, ItemListComponent],
  imports: [
    CommonModule,
    CardsModule,
    IconsModule,
    WavesModule
  ],
  providers: [ItemsService]
})
export class ItemsModule { }
