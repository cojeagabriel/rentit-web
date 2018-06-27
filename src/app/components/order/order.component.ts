import { ImageService } from './../../image.service';
import { OrderService } from './../../services/order.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { Order } from '../../types/order';
import { Product } from '../../types/product';
import { User } from '../../types/user';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  order: Order;
  product: Product;
  client: User;
  quantity: number;
  count: number;
  from: Date;
  to: Date;
  one_day = 1000 * 60 * 60 * 24;
  one_hour = 1000 * 60 * 60;

  orders: Order[];
  points: any;
  intervals: any;
  disabledDates: Date[] = [];
  maxim: number;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.orderService.getOrderById(this.activatedRoute.snapshot.params.id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe( order => {
        this.order = order[0];
        this.quantity = this.order.quantity;
        this.userService.getById(this.order._clientId)
          .catch(err => {
            return Observable.throw(new Error(`${err.status} ${err.msg}`));
          })
          .subscribe( client => {
            this.client = client[0];
          });

        this.productService.getById(this.order._productId)
          .catch(err => {
            return Observable.throw(new Error(`${err.status} ${err.msg}`));
          })
          .subscribe(product => {
            this.product = product[0];
            this.periodCount();

            this.orderService.getOrdersByProductId(this.product._id)
              .catch(err => {
                return Observable.throw(new Error(`${err.status} ${err.msg}`));
              })
              .subscribe(orders => {
                this.orders = orders;
                let points = [];

                this.orders.forEach(order => {
                  if ((order.status == 'reserved' || order.status == 'started') && order._id != this.order._id) {
                    var t = new Date();
                    t.setHours(0, 0, 0, 0);
                    var today = moment(t);
                    var from = moment(new Date(order.fromDateYear, order.fromDateMonth - 1, order.fromDateDay));
                    var to = moment(new Date(order.toDateYear, order.toDateMonth - 1, order.toDateDay));
                    var c = from.diff(today, 'days');
                    points.push({ node: c, count: order.quantity });
                    var c = to.diff(today, 'days');
                    points.push({ node: c, count: -order.quantity });
                  }
                });

                function compare(a, b) {
                  if (a.node > b.node) return 1;
                  else if (a.node < b.node) return -1;
                  else
                    if (a.count >= b.count) return -1;
                    else return 1;
                }
                points.sort(compare);

                this.points = points;

                this.buildIntervals();

                this.calculateIntervals();
                // this.calculateIsDisabled();
                this.calculateIntersection(this.from, this.to);
              });

          });
      })
  }

  buildIntervals(): void {
    var intervals = [];
    var s = 0;
    var last = {
      node: 0,
      count: 0
    }
    var i, j;
    if (this.points.length)
      last = { node: this.points[0].node, count: this.points[0].count };
    i = 1;
    while (i < this.points.length) {
      if (this.points[i].count > 0) {
        while (this.points[i].node == last.node && this.points[i].count > 0) {
          last.count += this.points[i].count;
          i++;
        }
        if (this.points[i].node == last.node) {
          s = 0;
          while (this.points[i].node == last.node && this.points[i].count < 0) {
            s += this.points[i].count;
            i++;
          }
          intervals.push({ start: last.node, end: last.node, count: last.count });
          last = { node: last.node + 1, count: last.count + s };
        }
        else if (this.points[i].count > 0) {
          intervals.push({ start: last.node, end: this.points[i].node - 1, count: last.count });
          last = { node: this.points[i].node, count: last.count };
        }
        else if (this.points[i].count < 0) {
          s = this.points[i].count;
          i++;
          while (i < this.points.length && this.points[i].node == this.points[i - 1].node) {
            s += this.points[i].count;
            i++;
          }
          intervals.push({ start: last.node, end: this.points[i - 1].node, count: last.count });
          last = { node: this.points[i - 1].node + 1, count: last.count + s };
        }

      }
      else {
        s = this.points[i].count;
        i++;
        while (i < this.points.length && this.points[i].node == this.points[i - 1].node && this.points[i].count < 0) {
          s += this.points[i].count;
          i++;
        }
        intervals.push({ start: last.node, end: this.points[i - 1].node, count: last.count });
        last = { node: last.node + 1, count: last.count + s };
      }

    }
    this.intervals = intervals;
    // console.log(this.intervals);
  }

  calculateIntervals(): void {
    this.intervals.forEach(interval => {
      for (var i = interval.start; i <= interval.end; i++)
        if (this.product.quantity - interval.count < this.quantity) {
          var disabledDate = moment(new Date());
          disabledDate.add(i, 'day');
          this.disabledDates.push(disabledDate.toDate());
        }
    });
  }

  calculateIntersection(from: Date, to: Date) {
    from.setMonth(from.getMonth()-1);
    to.setMonth(to.getMonth()-1);
    let parsedFrom = moment(from.setHours(0, 0, 0, 0));
    let parsedTo = moment(to.setHours(0, 0, 0, 0));
    let t = new Date();
    t.setHours(0, 0, 0, 0);
    let today = moment(t);
    let node1 = parsedFrom.diff(today, 'days');
    let node2 = parsedTo.diff(today, 'days');
    this.maxim = 0;
    let ok = true;
    this.intervals.forEach(interval => {
      if ((interval.start >= node1 && interval.start <= node2) || (interval.end >= node1 && interval.end <= node2))
        if (interval.count > this.maxim)
          this.maxim = interval.count;
      if ((this.product.quantity - this.quantity < interval.count) && ((interval.start >= node1 && interval.start <= node2) || (interval.end >= node1 && interval.end <= node2)))
        ok = false;
    });
  }

  quantityPlus(): void {
    if (this.quantity < this.product.quantity - this.maxim)
      this.quantity = this.quantity + 1;
  }

  quantityMinus(): void {
    if (this.quantity > 1)
      this.quantity = this.quantity - 1;
  }

  periodCount(): void {
    this.from = new Date(this.order.fromDateYear, this.order.fromDateMonth, this.order.fromDateDay);
    this.to = new Date(this.order.toDateYear, this.order.toDateMonth, this.order.toDateDay);
    if (this.product.pricePer == 'Day') {
      var from = moment(this.from);
      var to = moment(this.to);
      this.count = to.diff(from, 'days') + 1;
    }
    else if (this.product.pricePer == 'Hour') {
      this.count = (this.to.getTime() - this.from.getTime()) / this.one_hour;
    }
    else {
      this.count = 0;
    }
  }

  acceptOrder(): void{
    this.order.quantity = this.quantity;
    this.order.price = this.quantity*this.count*this.product.price;
    if(this.order.status=='reserved')
      this.order.status='started';
    else
      this.order.status='reserved';

    this.productService.update(this.product, this.product._id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(() => {
      });
    
    this.orderService.update(this.order, this.activatedRoute.snapshot.params.id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(()=> {
      });
  }

  cancelOrder(): void{
    this.order.status='canceled';

    this.productService.update(this.product, this.product._id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(() => {
      });

    this.orderService.update(this.order, this.activatedRoute.snapshot.params.id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(() => {
      });

    this.router.navigate(['dashboard/my-orders']);
  }

  endOrder(): void{
    this.order.status = 'ended';
    this.productService.update(this.product, this.product._id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(() => {
      });

    this.orderService.update(this.order, this.activatedRoute.snapshot.params.id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(() => {
      });
  }

  revert(): void{
    this.order.status = 'reserved';

    this.productService.update(this.product, this.product._id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(() => {
      });

    this.orderService.update(this.order, this.activatedRoute.snapshot.params.id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(() => {
      });
  }
  get mainImageUrl(): string {
    return this.product ? this.imageService.getImageUrl(this.product.images[0]) : '';
  }
}
