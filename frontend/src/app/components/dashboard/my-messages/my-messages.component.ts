import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { Message } from '../../../types/message';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss']
})
export class MyMessagesComponent implements OnInit {

  messages: Message[];

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.userService.getMe()
      .subscribe(user => {
        this.messageService.getMessagesByRecieverId(user._id)
          .catch(err => {
            return Observable.throw(err);
          })
          .subscribe(messages => {
            this.messages = messages;
            console.log(this.messages);
          });
      });
    
  }

}
