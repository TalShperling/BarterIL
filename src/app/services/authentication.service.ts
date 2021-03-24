import {Injectable} from '@angular/core';
import {WindowService} from './window.service';
import firebase from 'firebase';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '../../entities/user.model';
import UserCredential = firebase.auth.UserCredential;


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  windowRef: any;
  private isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
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

  verify(verificationCode: string, email: string, password: string): Observable<any> {
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
    return new Observable<UserCredential>(observer => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          observer.next(userCredential);
          this.isUserLoggedIn$.next(true);
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getCurrentUser(): firebase.User {
    return firebase.auth().currentUser;
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem(this.userKey);
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem(this.userKey));
  }

  saveUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.isUserLoggedIn$.next(true);
  }

  logout(): void {
    of(firebase.auth().signOut()).subscribe(() => {
      localStorage.removeItem(this.userKey);
      this.isUserLoggedIn$.next(false);
    });
  }

  getIsUserLoggedIn$(): Observable<boolean> {
    return this.isUserLoggedIn$.asObservable();
  }
}