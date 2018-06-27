import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-order-sent-confirmation-modal',
  templateUrl: './order-sent-confirmation-modal.component.html',
  styleUrls: ['./order-sent-confirmation-modal.component.scss']
})
export class OrderSentConfirmationModalComponent implements OnInit {

  _rentalId: String;

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit() {

  }

  continue(){
    this.bsModalRef.hide();
  }

}
