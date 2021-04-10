import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class ObservableListener implements OnDestroy {
  unsubscribeOnDestroy: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }
}
