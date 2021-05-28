import { EventEmitter } from "@angular/core";

export type Filter<T> = {
    text: string,
    isActive: boolean,
    func: () => void;
}