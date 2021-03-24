import {Injectable} from '@angular/core';
import {User} from '../../../entities/user.model';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import { IFirebaseService } from '../firebase/models/firebase-service.interface';
import { CollectionType } from '../firebase/models/collection-type.model';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UsersService implements IFirebaseService<User> {
  collectionName: CollectionType = CollectionType.USERS;

  constructor(private firebaseService: FirebaseService) {}
  
  getAll$(): Observable<User[]> {
    return this.firebaseService.getAllData$<User>(this.collectionName);
  }
  getById$(id: string): Observable<User> {
    return this.firebaseService.getDataById$<User>(this.collectionName, id);
  }
  upsert$(data: User): Observable<User> {
    return this.firebaseService.upsertData<User>(this.collectionName, data);
  }
  delete$(data: User): Observable<void> {
    return this.firebaseService.deleteData<User>(this.collectionName, data);
  }
}

