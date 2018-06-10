import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';
import { Message } from '../../types/message';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap';
import { NewMessageModalComponent } from '../new-message-modal/new-message-modal.component';
import { User } from '../../types/user';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  message: Message;
  user: User;

  popoverTitle: string = 'Confirm delete';
  popoverMessage: string = 'Are you sure you want to delete this message?';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

  constructor(
    private messageService: MessageService,
    private modalService: BsModalService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.messageService.getById(this.activatedRoute.snapshot.params.id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(message => {
        this.message = message[0];
      });

    this.userService.getMe()
      .subscribe(user => {
        this.user = user;
      });
  }

  delete(){
    this.messageService.delete(this.message)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(res => {
        this.router.navigate(['/dashboard/my-messages']);
      });
  }

  showMessageModal() {
    this.modalService.show(NewMessageModalComponent, {
      initialState: {
        message: "New message",
        sender: this.user._id,
        senderFirstName: this.user.firstName,
        senderLastName: this.user.lastName,
        reciever: this.message._senderId
      }
    });
  }

}
