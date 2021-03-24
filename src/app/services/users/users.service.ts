import {Injectable} from '@angular/core';
import {User} from '../../../entities/user.model';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable()
export class UsersService {

  constructor(private firestore: AngularFirestore) {
  }

  getUserByID(id: string): Observable<User> {
    return new Observable<User>(observer => {
      this.firestore.collection<User>('users').doc(id).get().subscribe(user => {
        observer.next(user.data() as User);
      });
    });
  }

  createNewUser(user: User): Observable<User> {
    return new Observable<User>(observer => {
        this.firestore.collection('users').doc(user.id).set(user).then(() => {
          observer.next(user);
        });
      }
    );
  }
}

