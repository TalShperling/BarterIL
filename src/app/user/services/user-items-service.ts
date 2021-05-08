import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserItems } from 'src/entities/user-items.model';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CollectionType } from '../../services/firebase/models/collection-type.model';
import { IFirebaseService } from '../../services/firebase/models/firebase-service.interface';

@Injectable()
export class UserItemsService implements IFirebaseService<UserItems> {
  collectionName: CollectionType = CollectionType.USERS_ITEMS;

  constructor(private firebaseService: FirebaseService) {
  }

  getAll$(): Observable<UserItems[]> {
    return this.firebaseService.getAllData$<UserItems>(this.collectionName);
  }

  getById$(id: string): Observable<UserItems> {
    return this.firebaseService.getDataById$<UserItems>(this.collectionName, id);
  }

  upsert$(data: UserItems): Observable<UserItems> {
    return this.firebaseService.upsertDocument<UserItems>(this.collectionName, data);
  }

  delete$(data: UserItems): Observable<void> {
    return this.firebaseService.deleteDocument<UserItems>(this.collectionName, data);
  }
}

