import { Injectable } from '@angular/core';
import { WindowService } from '../../services/auth/window.service';
import firebase from 'firebase';
import { from, Observable } from 'rxjs';
import { User } from '../../../entities/user.model';
import { catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { VerificationModalComponent } from '../components/verification/verification-modal/verification-modal.component';
import { AngularFireAuth } from '@angular/fire/auth';
import ConfirmationResult = firebase.auth.ConfirmationResult;
import UserCredential = firebase.auth.UserCredential;


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  windowRef: any;
  confirmationResult: Observable<ConfirmationResult>;
  modalRef: MDBModalRef;
  private countryDialogCode = '+972';
  private userKey = 'USER';


  constructor(private windowService: WindowService, private modalService: MDBModalService, private afAuth: AngularFireAuth) {
    this.windowRef = windowService.windowRef;
  }

  signUp(phoneNumber: string): Observable<[ConfirmationResult, string]> {
    this.modalRef = this.modalService.show(VerificationModalComponent);
    return from(
      this.afAuth.signInWithPhoneNumber(this.countryDialogCode + phoneNumber, this.windowRef.recaptchaVerifier)
    ).pipe(
      withLatestFrom(this.modalRef.content.verificationEmitter as string),
      catchError((error) => {
        this.resetRecaptcha();
        throw error;
      })
    );
  }

  verify(confirmationResult: ConfirmationResult, verificationCode: string, email: string, password: string): Observable<UserCredential> {
    return from(confirmationResult.confirm(verificationCode)).pipe(
      switchMap(() => {
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        return this.afAuth.user.pipe(switchMap(user => user.linkWithCredential(credential)));
      })
    );
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  saveUserToLocalStorage(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  removeUserFromLocalStorage() {
    localStorage.removeItem(this.userKey);
  }

  getUserFromLocalStorage(): User {
    return JSON.parse(localStorage.getItem(this.userKey));
  }

  logout() {
    return from(this.afAuth.signOut());
  }

  getFirebaseCurrentUser$() {
    return this.afAuth.user;
  }

  private resetRecaptcha() {
    this.windowRef.grecaptcha.reset(this.windowRef.recaptchaWidgetId);
    this.windowRef.recaptchaVerifier.render().then((widgetId) => {
      this.windowRef.grecaptcha.reset(widgetId);
    });
  }
}
