import { Injectable } from '@angular/core';
import { WindowService } from '../../services/auth/window.service';
import firebase from 'firebase';
import { from, Observable } from 'rxjs';
import { User } from '../../../entities/user.model';
import UserCredential = firebase.auth.UserCredential;
import { catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import ConfirmationResult = firebase.auth.ConfirmationResult;
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { VerificationModalComponent } from '../components/verification/verification-modal/verification-modal.component';


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  windowRef: any;
  confirmationResult: Observable<ConfirmationResult>;
  modalRef: MDBModalRef;
  private countryDialogCode = '+972';
  private userKey = 'USER';


  constructor(private windowService: WindowService, private modalService: MDBModalService) {
    this.windowRef = windowService.windowRef;
  }

  signUp(phoneNumber: string): Observable<[ConfirmationResult, string]> {
    return from(
      firebase.auth().signInWithPhoneNumber(this.countryDialogCode + phoneNumber, this.windowRef.recaptchaVerifier)
    ).pipe(
      tap(() => this.modalRef = this.modalService.show(VerificationModalComponent)),
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
        return from(firebase.auth().currentUser.linkWithCredential(credential));
      })
    );
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    return from(firebase.auth().signInWithEmailAndPassword(email, password));
  }

  saveUserToLocalStorage(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout() {
    return from(firebase.auth().signOut());
  }

  getFirebaseCurrentUser() {
    return firebase.auth().currentUser;
  }

  private resetRecaptcha() {
    this.windowRef.grecaptcha.reset(this.windowRef.recaptchaWidgetId);
    this.windowRef.recaptchaVerifier.render().then((widgetId) => {
      this.windowRef.grecaptcha.reset(widgetId);
    });
  }
}
