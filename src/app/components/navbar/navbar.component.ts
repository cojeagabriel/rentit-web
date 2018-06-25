import { UserService } from './../../services/user.service';
import { LoginModalComponent } from './../login-modal/login-modal.component';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/of";
import "rxjs/add/operator/switchMap";
import { User } from '../../types/user';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ProductService } from 'app/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  user: User | null;
  user$: Observable<User>;
  userSubscribe: Subscription;
  isCollapsed = true;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private userService: UserService,
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user$ = this.userService.me$;
    this.userSubscribe = this.authService.authenticated()
      .switchMap(authenticated => {
        if(authenticated) {
          return this.userService.getMe();
        } else {
          return Observable.of(null);
        }
      })
      .subscribe(user => this.user = user);


    // this.authService.authenticated()
    //   .take(1)
    //   .subscribe(authenticated => {
    //     if(authenticated) {
    //       this.userService.getMe().subscribe(user => this.user = user);
    //     } else {
    //       this.user = null;
    //     }
    //   })


    // this.user$ = this.authService.authenticated()
    //   .switchMap(authenticated => {
    //     if (authenticated) {
    //       return this.userService.getMe();
    //     } else {
    //       return Observable.of(null);
    //     }
    //   })
    //   .share();
  }

  ngOnDestroy() {
    this.userSubscribe.unsubscribe();
  }

  showLoginModal(){
    this.modalService.show(LoginModalComponent);
  }

  logout() {
    this.authService.logout();
  }

  createNew() {
    this.productService.createTemp().subscribe(tempProduct => {
      this.router.navigate(['/dashboard/new-product', tempProduct._id]);
    });
  }
}
