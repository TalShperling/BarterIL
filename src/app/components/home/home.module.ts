import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {ItemsModule} from '../items/items.module';
import {ButtonsModule, IconsModule, WavesModule} from 'angular-bootstrap-md';
import {AddItemFloatButtonComponent} from '../add-item-float-button/add-item-float-button.component';

@NgModule({
  declarations: [HomeComponent, AddItemFloatButtonComponent],
  exports: [HomeComponent],
  imports: [
    ButtonsModule,
    IconsModule,
    WavesModule,
    ItemsModule
  ]
})
export class HomeModule {
}
