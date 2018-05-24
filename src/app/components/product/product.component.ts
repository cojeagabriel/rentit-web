import { OrderService } from './../../services/order.service';
import { FormGroup } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product';
import { switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators/tap';
import { User } from '../../types/user';
import { NgbDateStruct, NgbCalendar, NgbDatepickerConfig, NgbDateParserFormatter, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap';
import { RentModalComponent } from './rent-modal/rent-modal.component';
import { Order } from '../../types/order';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [NgbDatepickerConfig]
})

export class ProductComponent implements OnInit {
  [x: string]: any;

  user: User | null;
  me: User;
  product: Product;
  product$: any;

  hoveredDate: NgbDateStruct;

  today: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  from: Date;
  to: Date;
  count: any;
  quantity: number;
  one_day = 1000 * 60 * 60 * 24;
  one_hour = 1000 * 60 * 60;

  fromTime: NgbTimeStruct = { hour: 14, minute: 0, second: 0 };
  toTime: NgbTimeStruct = { hour: 14, minute: 0, second: 0 };
  hourStep = 1;
  minuteStep = 15;

  order: Order = {
    _rentorId: null,
    _clientId: null,
    _productId: null,
    quantity: null,
    fromDateYear: null,
    fromDateMonth: null,
    fromDateDay: null,
    fromDateHour: null,
    fromDateMinute: null,
    toDateYear: null,
    toDateMonth: null,
    toDateDay: null,
    toDateHour: null,
    toDateMinute: null,
    status: null
  };

  constructor(
    private modalService: BsModalService,
    private productService: ProductService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    calendar: NgbCalendar,
    config: NgbDatepickerConfig,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private orderService: OrderService
  ) { 
    this.today = calendar.getToday();
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
    config.minDate = { year: this.today.year, month: this.toDate.month, day: this.today.day-1 };
    this.quantity = 1;
  }

  isDisabled(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  ngOnInit() {
    this.product$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        return this.productService.getById(params.id)
      })
    );
    this.product$.subscribe(product =>{
      this.product = product[0];
      this.periodCount();
      this.userService.getById(this.product._ownerId)
        .catch(err => {
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(user =>{
          this.user = user[0];
        });
    });

    this.userService.getMe()
      .subscribe(user => {
        this.me = user;
      });
  }

  onDateChange(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.periodCount();
  }

  periodCount():void{
    this.from = new Date(this.ngbDateParserFormatter.format(this.fromDate));
    this.to = new Date(this.ngbDateParserFormatter.format(this.toDate));
    if(this.product.pricePer=='Day'){
      this.count = (this.to.getTime() - this.from.getTime()) / this.one_day ;
    }
    else if (this.product.pricePer =='Hour'){
      this.count = (this.to.getTime() - this.from.getTime()) / this.one_hour;
    }
    else{
      this.count = 0;
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  quantityPlus(): void {
    if (this.quantity <= 100) {
        this.quantity= this.quantity + 1
    }
  }

  quantityMinus(): void {
    if (this.quantity > 1) {
        this.quantity= this.quantity - 1
    }
  }

  showRentModal() {
    this.order._rentorId = this.product._ownerId;
    this.order._clientId = this.me._id;
    this.order._productId = this.product._id;
    this.order.quantity = this.quantity;
    this.order.fromDateYear = this.fromDate.year;
    this.order.fromDateMonth = this.fromDate.month;
    this.order.fromDateDay = this.fromDate.day;
    this.order.fromDateHour = this.fromTime.hour;
    this.order.fromDateMinute = this.fromTime.minute;
    this.order.toDateYear = this.toDate.year;
    this.order.toDateMonth = this.toDate.month;
    this.order.toDateDay = this.toDate.day;
    this.order.toDateHour = this.toTime.hour;
    this.order.toDateMinute = this.toTime.minute;
    this.orderService.setOrder(this.order);
    this.modalService.show(RentModalComponent);
  }

}
