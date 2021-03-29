import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  ButtonsModule,
  CardsModule,
  CheckboxModule,
  IconsModule,
  InputsModule,
  InputUtilitiesModule,
  WavesModule
} from 'angular-bootstrap-md';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {RouterModule} from '@angular/router';
import {VerificationModalComponent} from './components/verification/verification-modal/verification-modal.component';
import {UsersService} from '../services/users/users.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {AlertsService} from '../services/alerts/alerts.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [SignUpComponent, SignInComponent, VerificationModalComponent],
  exports: [SignUpComponent],
  imports: [
    CommonModule,
    CheckboxModule,
    WavesModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    CardsModule,
    ReactiveFormsModule,
    InputUtilitiesModule,
    RouterModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [
    UsersService,
    MatDatepickerModule,
    AlertsService
  ]
})
export class RegistrationModule {
}
