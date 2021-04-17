import { Component } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { ModalOptions } from 'src/entities/modal.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  options: ModalOptions;

  constructor(public modalRef: MDBModalRef) {}

}