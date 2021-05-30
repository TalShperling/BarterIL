import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BarterOfferComponent} from './components/barter-offer/barter-offer.component';
import {BarterOfferResolver} from './barter-offer.resolver';
import {ItemsModule} from '../items/items.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {ButtonsModule, CheckboxModule, IconsModule, InputsModule, TableModule, WavesModule} from 'angular-bootstrap-md';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {transactionsFeatureKey, transactionsReducer} from './reducers/transactions.reducer';
import {TransactionsEffects} from './effects/transactions.effects';
import {TransactionsService} from './services/transactions.service';
import { UserTransactionsComponent } from './components/user-transactions/user-transactions.component';
import {FormsModule} from '@angular/forms';
import {UserTransactionsResolver} from './user-transactions.resolver';
// import { TransactionsManagementComponent } from './components/transactions-management/transactions-management.component';
import { FilterTransactionsPipe } from '../components/pipes/filter-transactions.pipe';
// import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';


@NgModule({
  declarations: [
    BarterOfferComponent,
    // TransactionsTableComponent,
    UserTransactionsComponent,
    // TransactionsManagementComponent,
    FilterTransactionsPipe
  ],
  imports: [
    CommonModule,
    ItemsModule,
    MatFormFieldModule,
    StoreModule.forFeature(transactionsFeatureKey, transactionsReducer),
    EffectsModule.forFeature([TransactionsEffects]),
    MatInputModule,
    MatSelectModule,
    ButtonsModule,
    FormsModule,
    InputsModule,
    TableModule,
    WavesModule,
    IconsModule,
    CheckboxModule
  ],
  providers: [
    BarterOfferResolver,
    TransactionsService,
    UserTransactionsResolver
  ]
})
export class BarterModule {
}
