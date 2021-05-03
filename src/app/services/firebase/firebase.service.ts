import {Injectable} from '@angular/core';
import {combineLatest, from, Observable, of} from 'rxjs';
import {CollectionType} from './models/collection-type.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export abstract class FirebaseService {

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage
  ) { }

  /**
   * @param collection - the collection type
   * @param idField - the name of the id field
   * @returns all the data from type T an Observable of data as a synchronized array of JSON objects.
   */
  getAllData$<T extends { id: string }>(collection: CollectionType): Observable<T[]> {
    return this.firestore.collection<T>(collection).valueChanges({idField: 'id'});
  }

  getDataById$<T>(collection: CollectionType, id: string): Observable<T> {
    return this.firestore.doc<T>(`${collection}/${id}`).valueChanges();
  }

  upsertDocument<T extends { id: string }>(collection: CollectionType, data: T): Observable<T> {
    return new Observable<T>(observer => {
      const documentId = data.id || this.firestore.createId();
      this.firestore.doc<T>(`${collection}/${documentId}`)
        .set({...data, id: documentId}).then(() => observer.next({...data, id: documentId}));
    });
  }

  deleteDocument<T extends { id: string }>(collection: CollectionType, data: T): Observable<void> {
    return from(this.firestore.doc(`${collection}/${data.id}`).delete());
  }

  uploadFile(file, imageUUID: string): Observable<[AngularFireUploadTask, AngularFireStorageReference]> {
    const fileRef = this.storage.ref(imageUUID);
    return combineLatest(of(this.storage.upload(imageUUID, file)), of(fileRef));
  }
}
