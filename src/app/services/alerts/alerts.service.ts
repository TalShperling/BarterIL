import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class AlertsService {
  private action = 'close';
  private duration: number = 3000;

  constructor(private snackBar: MatSnackBar) {
  }

  showErrorAlert(message: string) {
    this.snackBar.open(message, this.action, {
      panelClass: ['notify-error'],
      duration: this.duration,
    });
  }

  showSuccessAlert(message: string) {
    this.snackBar.open(message, this.action, {
      panelClass: ['notify-success'],
      duration: this.duration,
    });
  }
}
