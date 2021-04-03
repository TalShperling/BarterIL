import {Injectable} from '@angular/core';
import {User} from '../../../entities/user.model';
import {Observable} from 'rxjs';
import {CollectionType} from '../../services/firebase/models/collection-type.model';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {IFirebaseService} from '../../services/firebase/models/firebase-service.interface';

@Injectable()
export class UsersService implements IFirebaseService<User> {
  collectionName: CollectionType = CollectionType.USERS;

  constructor(private firebaseService: FirebaseService) {
  }

  getAll$(): Observable<User[]> {
    return this.firebaseService.getAllData$<User>(this.collectionName);
  }

  getById$(id: string): Observable<User> {
    return this.firebaseService.getDataById$<User>(this.collectionName, id);
  }

  upsert$(data: User): Observable<User> {
    return this.firebaseService.upsertDocument<User>(this.collectionName, data);
  }

  delete$(data: User): Observable<void> {
    return this.firebaseService.deleteDocument<User>(this.collectionName, data);
  }

  update$(data: User): Observable<User> {
    return this.firebaseService.updateDocument<User>(this.collectionName, data);
  }
}

