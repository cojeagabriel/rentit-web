import { MessageService } from './../../services/message.service';
import { NewMessageModalComponent } from './../new-message-modal/new-message-modal.component';
import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap';
import { Message } from '../../types/message';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$: any;
  user: User;
  // messages: Message[];

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.user$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        return this.userService.getById(params.id)
      })
    );
    this.user$.subscribe(user =>{
      this.user = user[0];
    });

    // this.messageService.getMessages()
    //   .catch(err => {
    //     return Observable.throw(new Error(`${err.status} ${err.msg}`));
    //   })
    //   .subscribe(messages =>{
    //     this.messages = messages;
    //   });
  }

  showMessageModal(){
    this.modalService.show(NewMessageModalComponent, {
      initialState: {
        message: "Salut!",
        sender: this.user._id,
        reciever: this.user._id
      }
    });
  }

}
