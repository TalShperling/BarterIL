import { Observable } from "rxjs";
import { CollectionType } from "./collection-type.model";

export interface IFirebaseService<T extends { id: string }> {
    collectionName: CollectionType;
    getAllData$(): Observable<T[]>;
    getDataById$(id: string): Observable<T>;
    addData(data: T): Observable<void>;
    updateData(data: T): Observable<void>;
    deleteData(data: T): Observable<void>;
}