import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtuctComponent } from './components/protuct/protuct.component';
import { ItemsService } from './services/items.service';

@NgModule({
  declarations: [ProtuctComponent],
  imports: [
    CommonModule
  ],
  providers: [ItemsService]
})
export class ItemsModule { }
