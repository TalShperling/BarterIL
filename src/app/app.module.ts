import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BadgeModule, MDBBootstrapModule } from 'angular-bootstrap-md';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationModule } from './registration/registration.module';
import firebase from 'firebase/app';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HomeModule } from './home/home.module';

const firebaseConfig = {
  apiKey: 'AIzaSyBzQeNQNSI7QsIUcSwCneF8N-dybSGWNXs',
  authDomain: 'barteril.firebaseapp.com',
  databaseURL: 'https://barteril-default-rtdb.firebaseio.com',
  projectId: 'barteril',
  storageBucket: 'barteril.appspot.com',
  messagingSenderId: '257300103440',
  appId: '1:257300103440:web:02078eb8be326777ace595',
  measurementId: 'G-ZLF0G01PKB'
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BadgeModule,
    RegistrationModule,
    MDBBootstrapModule.forRoot(),
    AngularFireAuthModule,
    HomeModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
