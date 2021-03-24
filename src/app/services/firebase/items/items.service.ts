import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/entities/item.model';
import { FirebaseService } from '../firebase.service';
import { CollectionType } from '../models/collection-type.model';
import { IFirebaseService } from '../models/firebase-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemsService implements IFirebaseService<Item>{
  collectionName = CollectionType.ITEMS;

  constructor(private firebaseService: FirebaseService) {}

  getAllData$(): Observable<Item[]> {
    return this.firebaseService.getAllData$<Item>(this.collectionName);
  }
  getDataById$(id: string): Observable<Item> {
    return this.firebaseService.getDataById$<Item>(this.collectionName, id);
  }
  addData(data: Item): Observable<void> {
    return this.firebaseService.addData<Item>(this.collectionName, data);
  }
  updateData(data: Item): Observable<void> {
    return this.firebaseService.updateData<Item>(this.collectionName, data);
  }
  deleteData(data: Item): Observable<void> {
    return this.firebaseService.deleteData<Item>(this.collectionName, data);
  }
  
}
