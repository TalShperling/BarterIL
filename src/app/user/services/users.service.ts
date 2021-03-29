import { Injectable } from '@angular/core';
import { User } from '../../../entities/user.model';
import { from, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersService {

  constructor(private firestore: AngularFirestore) {
  }

  getUserByID(id: string): Observable<User> {
    return from(this.firestore.collection<User>('users').doc(id).get()).pipe(map(response => response.data()));
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

