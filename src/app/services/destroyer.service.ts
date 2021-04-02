import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class DestroyerService {
  private notifier$ = new Subject<void>();

  constructor() {
  }

  getNotifier$(): Subject<void> {
    return this.notifier$;
  }

  destroy(): void {
    this.notifier$.next();
    this.notifier$.complete();
  }
}
