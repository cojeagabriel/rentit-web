import { OrderService } from './../../services/order.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { Order } from '../../types/order';
import { Product } from '../../types/product';
import { User } from '../../types/user';
import { Observable } from 'rxjs/Observable';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngbDateParserFormatter: NgbDateParserFormatter,
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
          });
      })
  }

  quantityPlus(): void {
    if (this.quantity < this.product.available) {
      this.quantity = this.quantity + 1
    }
  }

  quantityMinus(): void {
    if (this.quantity > 1) {
      this.quantity = this.quantity - 1
    }
  }

  periodCount(): void {
    let from = new Date(this.order.fromDateYear, this.order.fromDateMonth, this.order.fromDateDay);
    let to = new Date(this.order.toDateYear, this.order.toDateMonth, this.order.toDateDay);
    if (this.product.pricePer == 'Day') {
      this.count = (to.getTime() - from.getTime()) / this.one_day;
    }
    else if (this.product.pricePer == 'Hour') {
      this.count = (to.getTime() - from.getTime()) / this.one_hour;
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

    this.product.available=this.product.available-this.quantity;
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
    this.product.available += this.order.quantity;

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
    this.product.available += this.order.quantity;
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
    this.product.available = this.product.quantity;

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
}
