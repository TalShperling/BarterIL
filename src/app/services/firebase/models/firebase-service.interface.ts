import {Observable} from 'rxjs';
import {CollectionType} from './collection-type.model';

export interface IFirebaseService<T extends { id: string }> {
    collectionName: CollectionType;
    getAll$(): Observable<T[]>;
    getById$(id: string): Observable<T>;
    upsert$(data: T): Observable<T>;
    delete$(data: T): Observable<void>;
}
