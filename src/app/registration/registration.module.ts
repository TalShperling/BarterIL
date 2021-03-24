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
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {VerificationModalComponent} from './components/verification/verification-modal/verification-modal.component';


@NgModule({
  declarations: [SignUpComponent, VerificationModalComponent],
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
  ],
  providers: []
})
export class RegistrationModule {
}
