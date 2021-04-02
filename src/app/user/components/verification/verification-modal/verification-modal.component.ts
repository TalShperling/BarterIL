import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MDBModalRef} from 'angular-bootstrap-md';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-verification-modal',
  templateUrl: './verification-modal.component.html',
  styleUrls: ['./verification-modal.component.scss']
})
export class VerificationModalComponent implements OnInit {
  @Output() verificationEmitter: EventEmitter<string> = new EventEmitter<string>();
  verificationForm: FormGroup;
  verificationCode: string;

  constructor(public modalRef: MDBModalRef) {
  }

  ngOnInit(): void {
    this.verificationForm = new FormGroup({
      verificationCodeForm: new FormControl('', [Validators.min(6), Validators.maxLength(6)])
    });
  }

  get verificationCodeForm(): AbstractControl {
    return this.verificationForm.get('verificationCodeForm');
  }

  onSubmit(): void {
    this.verificationEmitter.emit(this.verificationCode);
    this.modalRef.hide();
  }
}
