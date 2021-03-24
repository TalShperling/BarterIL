import { Injectable } from '@angular/core';
import { WindowService } from '../../services/auth/window.service';
import firebase from 'firebase';
import { from, Observable } from 'rxjs';
import { User } from '../../../entities/user.model';
import UserCredential = firebase.auth.UserCredential;


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  windowRef: any;
  private countryDialogCode = '+972';
  private userKey = 'USER';


  constructor(private windowService: WindowService) {
    this.windowRef = windowService.windowRef;
  }

  signUp(phoneNumber: string): Observable<any> {
    return new Observable<any>(observer => {
      firebase.auth().signInWithPhoneNumber(this.countryDialogCode + phoneNumber, this.windowRef.recaptchaVerifier)
        .then((confirmationResult) => {
          this.windowRef.confirmationResult = confirmationResult;
          observer.next();
        }).catch((error) => {
        observer.error(error);
        this.windowRef.grecaptcha.reset(this.windowRef.recaptchaWidgetId);
        this.windowRef.recaptchaVerifier.render().then((widgetId) => {
          this.windowRef.grecaptcha.reset(widgetId);
        });
      });
    });
  }

  verify(verificationCode: string, email: string, password: string): Observable<void> {
    return new Observable<any>(observer => {
      this.windowRef.confirmationResult.confirm(verificationCode).then((result) => {
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        firebase.auth().currentUser.linkWithCredential(credential).then(() => {
          observer.next();
        }).catch(error => {
          observer.error(error);
        });
      }).catch((error) => {
        observer.error(error);
      });
    });
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
}
