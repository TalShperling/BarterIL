import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { MODAL_ACTIONS } from './modal.actions';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {
  action: Subject<any> = new Subject();
  heading: string;
  content: any;

  constructor(public modalRef: MDBModalRef) {}
  
  ngOnInit(): void {
  }

  onAction(action: MODAL_ACTIONS) {
    this.action.next(action);
  }
}
