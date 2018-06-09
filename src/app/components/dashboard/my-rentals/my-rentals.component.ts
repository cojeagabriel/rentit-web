import { Component, OnInit } from '@angular/core';
import { Order } from '../../../types/order';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-my-rentals',
  templateUrl: './my-rentals.component.html',
  styleUrls: ['./my-rentals.component.scss']
})
export class MyRentalsComponent implements OnInit {

  orders: Order[];

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getMe()
      .subscribe(user => {
        this.orderService.getOrdersByClientId(user._id)
          .catch(err => {
            return Observable.throw(err);
          })
          .subscribe(orders => {
            this.orders = orders;
          });
      });
  }

}
