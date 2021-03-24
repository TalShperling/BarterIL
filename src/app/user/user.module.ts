import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { userFeatureKey, userReducer } from './reducers/user.reducer';
import { UsersService } from '../services/users/users.service';
import { SignInComponent } from './components/sign-in/sign-in.component';
import {
  ButtonsModule,
  CardsModule,
  CheckboxModule,
  IconsModule,
  InputsModule,
  InputUtilitiesModule,
  WavesModule
} from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VerificationModalComponent } from './components/verification/verification-modal/verification-modal.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  declarations: [SignInComponent, SignUpComponent, VerificationModalComponent],
  exports: [SignUpComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature(userFeatureKey, userReducer),
    ButtonsModule,
    CardsModule,
    CheckboxModule,
    IconsModule,
    InputsModule,
    InputUtilitiesModule,
    WavesModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [UsersService]
})
export class UserModule { }
