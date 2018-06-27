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
  filters: String[] = [];
  reserved: boolean = false;
  started: boolean = false;
  stopped: boolean = false;
  canceled: boolean = false;
  archived: boolean = false;

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
            this.orders = orders.reverse();
          });
      });
  }

  check(filter: String) {
    switch (filter) {
      case 'Reserved':
        if (!this.reserved) {
          this.filters[this.filters.length] = 'reserved';
          this.filters = this.filters.filter(f => f == f);
          this.reserved = true;
        }
        else {
          this.filters = this.filters.filter(f => f !== 'reserved');
          this.reserved = false;
        }
        break;
      case 'Started':
        if (!this.started) {
          this.filters.push('started');
          this.filters = this.filters.filter(f => f == f);
          this.started = true;
        }
        else {
          this.filters = this.filters.filter(f => f !== 'started');
          this.started = false;
        }
        break;
      case 'Stopped':
        if (!this.stopped) {
          this.filters.push('stopped');
          this.filters = this.filters.filter(f => f == f);
          this.stopped = true;
        }
        else {
          this.filters = this.filters.filter(f => f !== 'stopped');
          this.stopped = false;
        }
        break;
      case 'Canceled':
        if (!this.canceled) {
          this.filters.push('canceled');
          this.filters = this.filters.filter(f => f == f);
          this.canceled = true;
        }
        else {
          this.filters = this.filters.filter(f => f !== 'canceled');
          this.canceled = false;
        }
        break;
      case 'Archived':
        if (!this.archived) {
          this.filters.push('archived');
          this.filters = this.filters.filter(f => f == f);
          this.archived = true;
        }
        else {
          this.filters = this.filters.filter(f => f !== 'archived');
          this.archived = false;
        }
        break;

      default:
        break;
    }
  }

}
