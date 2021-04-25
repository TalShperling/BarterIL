import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Item} from 'src/entities/item.model';
import {FirebaseService} from '../firebase/firebase.service';
import {CollectionType} from '../firebase/models/collection-type.model';
import {IFirebaseService} from '../firebase/models/firebase-service.interface';

@Injectable()
export class ItemsService implements IFirebaseService<Item>{
  collectionName = CollectionType.ITEMS;

  constructor(private firebaseService: FirebaseService) {}

  getAll$(): Observable<Item[]> {
    return this.firebaseService.getAllData$<Item>(this.collectionName);
  }
  getById$(id: string): Observable<Item> {
    return this.firebaseService.getDataById$<Item>(this.collectionName, id);
  }
  upsert$(data: Item): Observable<Item> {
    return this.firebaseService.upsertDocument<Item>(this.collectionName, data);
  }
  delete$(data: Item): Observable<void> {
    return this.firebaseService.deleteDocument<Item>(this.collectionName, data);
  }

}
