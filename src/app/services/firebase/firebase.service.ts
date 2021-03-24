import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { CollectionType } from './models/collection-type.model';
import { AngularFirestore, DocumentChangeAction, QuerySnapshot } from '@angular/fire/firestore';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  /**
   * @param collection - the collection type
   * @param idField - the name of the id field
   * @returns all the data from type T an Observable of data as a synchronized array of JSON objects.
   */
  getAllData$<T extends { id: string }>(collection: CollectionType): Observable<T[]> {
    return this.firestore.collection<T>(collection).valueChanges();
  }

  getDataById$<T>(collection: CollectionType, id: string): Observable<T> {
    return this.firestore.doc<T>(`${collection}/${id}`).valueChanges();
  }

  upsertData<T extends { id: string }>(collection: CollectionType, data: T): Observable<T> {
    return new Observable<T>(observer => {
      if (!data.id) {
        data.id = this.firestore.createId();
      }
      this.firestore.doc<T>(`${collection}/${data.id}`).set(data).then(() => observer.next(data));
    });
  }

  deleteData<T extends { id: string }>(collection: CollectionType, data: T): Observable<void> {
    return from(this.firestore.doc(`${collection}/${data.id}`).delete());
  }
}
