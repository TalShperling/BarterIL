import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {userFeatureKey, userReducer} from './reducers/user.reducer';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {
  ButtonsModule,
  CardsModule,
  CheckboxModule,
  IconsModule,
  InputsModule,
  InputUtilitiesModule,
  WavesModule
} from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {VerificationModalComponent} from './components/verification/verification-modal/verification-modal.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {UserEffects} from './effects/user.effects';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {UsersService} from './services/users.service';
import {MatInputModule} from '@angular/material/input';
import {AlertsService} from '../services/alerts/alerts.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {UsersManagementComponent} from './components/users-management/users-management.component';
import {UserCardComponent} from './components/user-card/user-card/user-card.component';
import { UserEditByAdminModalComponent } from './components/user-edit-by-admin-modal/user-edit-by-admin-modal.component';
import {FilterUsersPipe} from '../components/pipes/filter-users.pipe';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    VerificationModalComponent,
    UserInfoComponent,
    UsersManagementComponent,
    UserCardComponent,
    UserEditByAdminModalComponent,
    FilterUsersPipe
  ],
  exports: [SignUpComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature(userFeatureKey, userReducer),
    EffectsModule.forFeature([UserEffects]),
    ButtonsModule,
    CardsModule,
    CheckboxModule,
    IconsModule,
    InputsModule,
    InputUtilitiesModule,
    WavesModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [
    UsersService,
    MatDatepickerModule,
    AlertsService
  ]
})
export class UserModule {
}
