import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BarterOfferComponent} from './components/barter-offer/barter-offer.component';
import {BarterOfferResolver} from './barter-offer.resolver';
import {ItemsModule} from '../items/items.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {ButtonsModule} from 'angular-bootstrap-md';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {transactionsFeatureKey, transactionsReducer} from './reducers/transactions.reducer';
import {TransactionsEffects} from './effects/transactions.effects';
import {TransactionsService} from './services/transactions.service';


@NgModule({
  declarations: [
    BarterOfferComponent,
  ],
  imports: [
    CommonModule,
    ItemsModule,
    MatFormFieldModule,
    StoreModule.forFeature(transactionsFeatureKey, transactionsReducer),
    EffectsModule.forFeature([TransactionsEffects]),
    MatInputModule,
    MatSelectModule,
    ButtonsModule
  ],
  providers: [
    BarterOfferResolver,
    TransactionsService
  ]
})
export class BarterModule {
}
