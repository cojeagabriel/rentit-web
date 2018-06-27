import { MessageService } from './../../services/message.service';
import { NewMessageModalComponent } from './../new-message-modal/new-message-modal.component';
import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$: any;
  user: User;
  me: User;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
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

    this.userService.getMe()
      .subscribe(user => {
        this.me = user;
      });
  }

  showMessageModal(){
    this.modalService.show(NewMessageModalComponent, {
      initialState: {
        message: "New message",
        sender: this.me._id,
        senderFirstName: this.me.firstName,
        senderLastName: this.me.lastName,
        reciever: this.user._id
      }
    });
  }

}
