import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-new-message-modal',
  templateUrl: './new-message-modal.component.html',
  styleUrls: ['./new-message-modal.component.scss']
})
export class NewMessageModalComponent implements OnInit {

  message: any;
  sender: string;
  reciever: string;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private messageService: MessageService
  ) { 
  }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm() {
    return this.formBuilder.group({
      _senderId: this.sender,
      _recieverId: this.reciever,
      title: this.formBuilder.control('test', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),      
      content: this.formBuilder.control('test', Validators.compose([Validators.required, Validators.maxLength(10000)])),
      dateYear: null,
      dateMonth: null,
      dateDay: null,
      dateHour: null,
      dateMinute: null
    });
  }

  sendMessage(){

    var t = new Date();
    var today = moment(t);
    if (this.form.valid) {
      this.form.patchValue({
        dateYear: today.year(),
        dateMonth: today.month(),
        dateDay: today.date(),
        dateHour: today.hour(),
        dateMinute: today.minute()
      });
      this.messageService.create(this.form.value)
        .catch(err => {
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(message => {
          this.bsModalRef.hide();
        })
    }

  }

}
