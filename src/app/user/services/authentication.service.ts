import {Injectable} from '@angular/core';
import {WindowService} from '../../services/auth/window.service';
import firebase from 'firebase';
import {combineLatest, from, Observable} from 'rxjs';
import {User} from '../../../entities/user.model';
import {catchError, first, mergeMap, take, tap} from 'rxjs/operators';
import {MDBModalRef, MDBModalService} from 'angular-bootstrap-md';
import {VerificationModalComponent} from '../components/verification/verification-modal/verification-modal.component';
import {AngularFireAuth} from '@angular/fire/auth';
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


  constructor(private windowService: WindowService, private modalService: MDBModalService, private angularFireAuth: AngularFireAuth) {
    this.windowRef = windowService.windowRef;
  }

  signUp$(phoneNumber: string): Observable<[ConfirmationResult, string]> {
    this.modalRef = this.modalService.show(VerificationModalComponent);
    return combineLatest(
      from(this.angularFireAuth.signInWithPhoneNumber(this.countryDialogCode + phoneNumber, this.windowRef.recaptchaVerifier)),
      this.modalRef.content.verificationEmitter as string
    ).pipe(
      catchError((error) => {
        this.resetRecaptcha();
        throw error;
      })
    );
  }

  verify$(confirmationResult: ConfirmationResult, verificationCode: string, email: string, password: string): Observable<UserCredential> {
    return from(confirmationResult.confirm(verificationCode)).pipe(
      tap(() => {
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        this.angularFireAuth.user.pipe(take(1)).subscribe(user => user.linkWithCredential(credential).catch(error => {
          throw error;
        }));
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  signIn$(email: string, password: string): Observable<UserCredential> {
    return from(this.angularFireAuth.signInWithEmailAndPassword(email, password));
  }

  saveUserToLocalStorage(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  removeUserFromLocalStorage(): void {
    localStorage.removeItem(this.userKey);
  }

  getUserFromLocalStorage(): User {
    return JSON.parse(localStorage.getItem(this.userKey));
  }

  logout$(): Observable<void> {
    return from(this.angularFireAuth.signOut());
  }

  getFirebaseCurrentUser$(): Observable<firebase.User> {
    return this.angularFireAuth.user;
  }

  updateUserEmail(email: string): Observable<void> {
    return this.getFirebaseCurrentUser$().pipe(mergeMap(user => {
        return from(user.updateEmail(email));
      }),
      catchError((error) => {
        throw error;
      }));
  }

  updateUserEmailWithAuthentication(confirmationResult: string, verificationCode: string, email: string): Observable<void> {
    return this.getFirebaseCurrentUser$().pipe(first(), mergeMap(user => {
        return from(user.reauthenticateWithCredential(firebase.auth.PhoneAuthProvider.credential(confirmationResult, verificationCode)))
          .pipe(mergeMap(() => from(user.updateEmail(email))));
      }),
      catchError((error) => {
        throw error;
      }));
  }

  verifyPhoneNumberAndCode(phoneNumber: string): Observable<[string, string]> {
    const provider = new firebase.auth.PhoneAuthProvider();
    this.modalRef = this.modalService.show(VerificationModalComponent);

    return combineLatest(
      from(provider.verifyPhoneNumber(this.countryDialogCode + phoneNumber, this.windowRef.recaptchaVerifier)),
      this.modalRef.content.verificationEmitter as string
    ).pipe(
      catchError((error) => {
        this.resetRecaptcha();
        throw error;
      })
    );
  }

  updateUserPhoneNumber(confirmationResult: string, verificationCode: string): Observable<void> {
    const phoneCredential = firebase.auth.PhoneAuthProvider.credential(confirmationResult, verificationCode);
    return from(firebase.auth().currentUser.updatePhoneNumber(phoneCredential))
      .pipe(catchError((error) => {
        throw error;
      }));
  }

  private resetRecaptcha(): void {
    this.windowRef.grecaptcha.reset(this.windowRef.recaptchaWidgetId);
    this.windowRef.recaptchaVerifier.render().then((widgetId) => {
      this.windowRef.grecaptcha.reset(widgetId);
    });
  }
}
