import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { userFeatureKey, userReducer } from './reducers/user.reducer';
import { UsersService } from './services/users.service';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VerificationModalComponent } from './components/verification/verification-modal/verification-modal.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserEffects } from './effects/user.effects';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [SignInComponent, SignUpComponent, VerificationModalComponent],
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
    MatNativeDateModule,
    FormsModule
  ],
  providers: [UsersService, MatDatepickerModule]
})
export class UserModule { }
