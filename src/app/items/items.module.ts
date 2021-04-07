import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './components/product/product.component';
import { ItemsService } from './services/items.service';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule
  ],
  providers: [ItemsService]
})
export class ItemsModule { }
