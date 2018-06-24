import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../types/user';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  user: User | null;
  user$: Observable<User>;
  userSubscribe: Subscription;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user$ = this.userService.me$;
    this.userSubscribe = this.authService.authenticated()
      .switchMap(authenticated => {
        if (authenticated) {
          return this.userService.getMe();
        } else {
          return Observable.of(null);
        }
      })
      .subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.userSubscribe.unsubscribe();
  }

  showLoginModal() {
    this.modalService.show(LoginModalComponent);
  }

  showRegisterModal() {
    this.modalService.show(RegisterModalComponent);
  }

  logout() {
    this.authService.logout();
  }

}
