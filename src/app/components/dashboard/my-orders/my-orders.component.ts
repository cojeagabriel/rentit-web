import { UserService } from './../../../services/user.service';
import { OrderService } from './../../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { Order } from '../../../types/order';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  orders: Order[];

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getMe()
      .subscribe(user => {
        this.orderService.getOrdersByOwnerId(user._id)
          .catch(err => {
            return Observable.throw(err);
          })
          .subscribe(orders => {
            this.orders = orders;
          });
      });
  }

}
